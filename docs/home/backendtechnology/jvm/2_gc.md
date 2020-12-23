---
title: GC
---
### Garbage Collector GC tuning


#### 1.什么是垃圾

> C语言申请内存：malloc free
>
> C++： new delete
>
> c/C++ 手动回收内存
>
> Java: new ？
>
> 自动内存回收，编程上简单，系统不容易出错，手动释放内存，容易出两种类型的问题：
>
> 1. 忘记回收
> 2. 多次回收

#### 2.如何定位垃圾

1. 引用计数（ReferenceCount）
2. 根可达算法(RootSearching) jvm 用的


#### 3.常见的垃圾回收算法

1. 标记清除(mark sweep) -(根可达) 位置不连续 产生碎片 效率偏低（两遍扫描）(存活对象比较多的情况下 效率高)
2. 拷贝算法 (copying) -(根可达)  没有碎片，浪费空间(一分为二 适合存活对象较少 例如eden区)
3. 标记压缩(mark compact)(根可达)  - 没有碎片，效率偏低 不会产生碎片,方便对象分配（两遍扫描，指针需要调整(移动对象)）

#### 4.JVM内存分代模型（用于分代垃圾回收算法）

1. 部分垃圾回收器使用的模型

![gc.png](/img/jvm/gc.png)  新生代和老年代默认 1:3

   > 除Epsilon ZGC Shenandoah 这三个之外的GC都是使用逻辑分代模型
   >
   > G1是逻辑分代，物理不分代
   >
   > 除此之外不仅逻辑分代，而且物理分代


   
   1个对象从出生到消亡=> 先尝试栈上分配(如果栈上分配不下 就去eden区 大对象直接老年代) 
   =>s0-s1之前的复制年龄超过限制时进入老年代(参数 -XX:MaxTenuringThreshold配置)
   
   首先 栈上分配(线程私有小对象 无逃逸 支持标量替换)
   如果分配不了-> 线程本地分配TLAB(Thread Local Allocation Buffer) [占用eden 默认1%  多线程的时候不用竞争eden可以申请空间,提高效率 小对象]
   然后 老年代分配大对象
    
     
   
2.  新生代 + 老年代 + 永久代（1.7）Perm Generation/ 元数据区(1.8) Metaspace

3.  gc收集器

![gc2.png](/img/jvm/gc2.png) 

JDK刚诞生 serial + serial old(老年代)

之后 parallel scavenge +parallel old(老年代)

然后 parnew +cms(老年代)

1.8默认的垃圾回收：parallel scavenge+ Parallel Old


##### serial + serial old:
都是单线程 (新生代: 拷贝算法)(老年代: 标记清除或者标记压缩(标记整理))


##### parallel scavenge +parallel old:
多线程的 (新生代: 拷贝算法)(老年代: 标记压缩(标记整理))

##### parnew +cms
parnew 和 cms配合 (parnew 可以在cms运行间隙运行)
cms 是1.4版本后期引入(问题比较多)
cms => 初始标记(标志 root 会STW) =>并发标记(和用户进程一起)
=>重新标记(标记并发标记中出现的垃圾  会STW)=>并发清理(会产生浮动垃圾)
   
#### 4.JVM内存分代模型（用于分代垃圾回收算法）

1. 部分垃圾回收器使用的模型

   > 除Epsilon ZGC Shenandoah之外的GC都是使用逻辑分代模型
   >
   > G1是逻辑分代，物理不分代
   >
   > 除此之外不仅逻辑分代，而且物理分代

2. 新生代 + 老年代 + 永久代（1.7）Perm Generation/ 元数据区(1.8) Metaspace

   1. 永久代 元数据 - Class
   2. 永久代必须指定大小限制 ，元数据可以设置，也可以不设置，无上限（受限于物理内存）
   3. 字符串常量 1.7 - 永久代，1.8 - 堆
   4. MethodArea逻辑概念 - 永久代、元数据

3. 新生代 = Eden + 2个suvivor区 

   1. YGC回收之后，大多数的对象会被回收，活着的进入s0
   2. 再次YGC，活着的对象eden + s0 -> s1
   3. 再次YGC，eden + s1 -> s0
   4. 年龄足够 -> 老年代 （15 CMS 6）
   5. s区装不下 -> 老年代

4. 老年代

   1. 顽固分子
   2. 老年代满了FGC Full GC

5. GC Tuning (Generation)

   1. 尽量减少FGC
   2. MinorGC = YGC
   3. MajorGC = FGC
   
   
#### 5.常见的垃圾回收器


1. JDK诞生 Serial追随 提高效率，诞生了PS，为了配合CMS，诞生了PN，CMS是1.4版本后期引入，CMS是里程碑式的GC，它开启了并发回收的过程，但是CMS毛病较多，因此目前任何一个JDK版本默认是CMS
   并发垃圾回收是因为无法忍受STW
2. Serial 年轻代 串行回收
3. PS 年轻代 并行回收
4. ParNew 年轻代 配合CMS的并行回收
5. SerialOld 
6. ParallelOld
7. ConcurrentMarkSweep 老年代 并发的， 垃圾回收和应用程序同时运行，降低STW的时间(200ms)
   CMS问题比较多，所以现在没有一个版本默认是CMS，只能手工指定
   CMS既然是MarkSweep，就一定会有碎片化的问题，碎片到达一定程度，CMS的老年代分配对象分配不下的时候，使用SerialOld 进行老年代回收
   想象一下：
   PS + PO -> 加内存 换垃圾回收器 -> PN + CMS + SerialOld（几个小时 - 几天的STW）
   几十个G的内存，单线程回收 -> G1 + FGC 几十个G -> 上T内存的服务器 ZGC
   算法：三色标记 + Incremental Update
8. G1(10ms) 1.7才有  1.8完善  1.9默认
   算法：三色标记 + SATB
9. ZGC (1ms) PK C++
   算法：ColoredPointers + LoadBarrier
10. Shenandoah
    算法：ColoredPointers + WriteBarrier
11. Eplison
12. PS 和 PN区别的延伸阅读：
    ▪[https://docs.oracle.com/en/java/javase/13/gctuning/ergonomics.html#GUID-3D0BB91E-9BFF-4EBB-B523-14493A860E73](https://docs.oracle.com/en/java/javase/13/gctuning/ergonomics.html)
13. 垃圾收集器跟内存大小的关系
    1. Serial 几十兆
    2. PS 上百兆 - 几个G
    3. CMS - 20G
    4. G1 - 上百G
    5. ZGC - 4T - 16T（JDK13）

1.8默认的垃圾回收：PS + ParallelOld      