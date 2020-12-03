---
title: JVM
---
### JVM加载到执行

X.java -> javac -> X.class =>被classLoader 装载到内存(连同java类库一起)
->(调用字节码解释器 或者JIT即时解释器)=>执行引擎=>os硬件

### ClassFileFormat
#### 二进制字节流
#### 数据类型 u1 u2 u4 u8和 _info(表类型)
_info的来源是hotspot源码的写法
#### 查看 16进制格式的classfile
sublime notpad
idea插件 BinEd
#### 查看ByteCode的方法
javap

JBE

JClassLin IDEA插件之一

#### 16进制 

(magic CA FE BA BE) ( minor version 00 00 ) (major version 00 34  jdk1.8) 
(常量池有多少个就是这个数量转10进制-1 也就是15 00 10)  0 1 0 0 这么数 little endin

#### volatile 实现细节
##### 字节码层面
ACC_VOLATILE

##### JVM层面
StoreStoreBarrier
volatile写操作
StoreStoreBarrier

StoreStoreBarrier
volatile读操作
StoreStoreBarrier

##### OS和硬件层面
hsdis- HotSpot Dis Assembler

#### synchronized 实现细节
##### 字节码层面
monitorenter monitorexit

##### JVM层面

C C++ 调用了操作系统提供的同步指令

#####OS和硬件层面
x86 lock comxchg xxxx

#### 对象的内存布局
##### 普通对象

1. 对象头：markword  8

2. ClassPointer指针：-XX:+UseCompressedClassPointers(对象压缩指针) 为4字节 不开启为8字节

3. 实例数据
   1. 引用类型：-XX:+UseCompressedOops(引用指针压缩) 为4字节 不开启为8字节 
      Oops Ordinary Object Pointers 
   2. 基本数据类型   就根据他的长度
4. Padding对齐，对其为8的倍数

##### 数组对象

1. 对象头：markword 8

2. ClassPointer指针同上

3. 数组长度：4字节

4. 数组数据

5. 对齐 对其为8的倍数


#### 对象的创建过程
1.class loading new 之后 加载到内存

2.class linking(verification(校验),preparation(静态变量设默认值) ,resolution(解析))

3. class Initializing( 初始化 ->静态变量设为初始值 执行静态语句块)

4.申请对象内存

5.成员变量赋默认值

6.调用构造方法 (init)
 1.成员变狼顺序赋初始值
 2.执行构造方法语句

##### 对象头
![markword.png](/img/jvm/markword.png) 32位的
markword 64位
有对象的hashcode 25bit
分代年龄  4bit
是否偏向锁 1bit 
2bit 锁标志位

##### 对象怎么定位

1. 句柄池
2. 直接指针
就HotSpot而言，他使用的是直接指针访问方式进行对象访问，