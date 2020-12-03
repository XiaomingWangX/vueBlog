---
title: ThreadPoolExecutor  线程池
---
# ThreadPoolExecutor线程池理解

## 1.线程池的4个构造方法

```java 

// 五个参数的构造函数
public ThreadPoolExecutor(int corePoolSize,
                          int maximumPoolSize,
                          long keepAliveTime,
                          TimeUnit unit,
                          BlockingQueue<Runnable> workQueue)

// 六个参数的构造函数-1
public ThreadPoolExecutor(int corePoolSize,
                          int maximumPoolSize,
                          long keepAliveTime,
                          TimeUnit unit,
                          BlockingQueue<Runnable> workQueue,
                          ThreadFactory threadFactory)

// 六个参数的构造函数-2
public ThreadPoolExecutor(int corePoolSize,
                          int maximumPoolSize,
                          long keepAliveTime,
                          TimeUnit unit,
                          BlockingQueue<Runnable> workQueue,
                          RejectedExecutionHandler handler)

// 七个参数的构造函数
public ThreadPoolExecutor(int corePoolSize,
                          int maximumPoolSize,
                          long keepAliveTime,
                          TimeUnit unit,
                          BlockingQueue<Runnable> workQueue,
                          ThreadFactory threadFactory,
                          RejectedExecutionHandler handler)

```

**参数解释：最多的构造函数有七个入参，最少的5个入参。这里为5个必传，和2个非必传（有默认值）。**
### 5个必填

> corePoolSize：核心线程数，不会因线程空闲而被销毁的线程。
  
 >  maximumPoolSize：最大线程数，线程池分为两种线程，核心线程和非核心线程。非核心线程在空闲指定时长后会被销毁，而核心线程不会。
  
 >  keepAliveTime：非核心线程最大存活时长。
  
 >  unit：非核心线程最大存活时长单位。
  
 >  workQueue：阻塞队列，存放着等待执行的线程任务。
 
 **几种常见的workQueue**
  * 1.LinkedBlockingQueue
  链式阻塞队列，底层数据结构是链表，默认大小是Integer.MAX_VALUE，也可以指定大小
  * 2.ArrayBlockingQueue
  数组阻塞队列，底层数据结构是数组，需要指定队列的大小。
  * 3.SynchronousQueue
  同步队列，内部容量为0，每个put操作必须等待一个take操作，反之亦然。
  * 4.DelayQueue
  延迟队列，该队列中的元素只有当其指定的延迟时间到了，才能够从队列中获取到该元素 。
        
        
### 2个非必填

> threadFactory：创建线程的工厂，可以自定义线程的名字，设置一些参数等等，如果不想自定义，可以使用默认的创建工厂。Executors.defaultThreadFactory()

> handler：拒绝策略，当线程池无法在接受任务时，所调用的处理策略。


 **几种拒绝策略**
 
 * 1.ThreadPoolExecutor.AbortPolicy：默认拒绝处理策略，丢弃任务并抛出RejectedExecutionException异常。
 * 2.ThreadPoolExecutor.DiscardPolicy：丢弃新来的任务，但是不抛出异常。
 * 3.ThreadPoolExecutor.DiscardOldestPolicy：丢弃队列头部（最旧的）的任务，然后重新尝试执行程序（如果再次失败，重复此过程）。
 * 4.ThreadPoolExecutor.CallerRunsPolicy：由调用线程处理该任务。


## 2.线程池处理流程

* 1.如果线程池中线程总数量 < 核心线程数，不管核心线程是否有空闲，就会创建核心线程，以便于线程池中以最快速度达到核心线程数，但前提是线程池中线程总数量 < 核心线程数。
* 2.当线程池中线程总数量 >= 核心线程数时，新来的的线程任务就会进入到缓存队列中存放，然后空闲的核心线程会来取出并执行线程任务。
* 3.当缓存队列中也满了，说明这个时候系统的并发很高，这是线程池就需要一些帮手了，会创建非核心线程，用于处理新来的线程任务，以便于快速处理业务，创建非核心线程的前提是 线程池最大线程数 < 核心线程数 + 非核心线程数，也就是说核心线程数和非核心线程数之和不能超过最大线程数，可以等于。
* 4.当缓存队列满了，线程池中线程数也达到了设置的最大线程数，这是新来的任务，线程池就会用拒绝策略去拒绝这些任务。

## 3.创建线程池的几种默认实现

* newCachedThreadPool
```java 
public static ExecutorService newCachedThreadPool() {
    return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                  60L, TimeUnit.SECONDS,
                                  new SynchronousQueue<Runnable>());
}

```
:::tip
核心线程是0,非核心线程Integer.MAX_VALUE, 60秒自动回收,处理短时间并发比较好,但是并发线程数多,堆内存会溢出
:::

* newFixedThreadPool
```java 
public static ExecutorService newFixedThreadPool(int nThreads) {
    return new ThreadPoolExecutor(nThreads, nThreads,
                                  0L, TimeUnit.MILLISECONDS,
                                  new LinkedBlockingQueue<Runnable>());
}

```
:::tip
这是一个池中都是核心线程的线程池，所有线程都不会销毁。该线程池执行任务的全是核心线程，当没有空闲的核心线程时，任务会进入到阻塞队列，直到有空闲的核心线程才会去从阻塞队列中取出任务并执行，也导致该线程池基本不会发生使用拒绝策略拒绝任务。还有因为LinkedBlockingQueue阻塞队列的大小默认是Integer.MAX_VALUE，如果使用不当，很可能导致内存溢出。
:::


* newSingleThreadExecutor
```java 
public static ExecutorService newSingleThreadExecutor() {
    return new FinalizableDelegatedExecutorService
        (new ThreadPoolExecutor(1, 1,
                                0L, TimeUnit.MILLISECONDS,
                                new LinkedBlockingQueue<Runnable>()));
}

```
:::tip
无参构造,这是一个只有一个核心线程的线程池，只要线程不空闲，任务就会进入阻塞队列。
:::


* newScheduledThreadPool
```java 
public static ScheduledExecutorService newScheduledThreadPool(int corePoolSize) {
    return new ScheduledThreadPoolExecutor(corePoolSize);
}

public ScheduledThreadPoolExecutor(int corePoolSize) {
    super(corePoolSize, Integer.MAX_VALUE, 0, NANOSECONDS,
          new DelayedWorkQueue());
}




ScheduledExecutorService pool = Executors.newScheduledThreadPool(10);
// 入参Runnable实例，延时时间，时间单位
pool.schedule(() -> System.out.println("执行1"), 5, TimeUnit.SECONDS);
pool.schedule(() -> System.out.println("执行2"), 4, TimeUnit.SECONDS);
pool.schedule(() -> System.out.println("执行3"), 6, TimeUnit.SECONDS);

// 打印结果
// 执行2
// 执行1
// 执行3

```
:::tip
这是一个支持延时任务执行的线程池。 延迟队列，该队列中的元素只有当其指定的延迟时间到了，才能够从队列中获取到该元素 。
:::