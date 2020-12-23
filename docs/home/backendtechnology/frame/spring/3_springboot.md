---
title: SpringBoot
---


## 启动
入口:@SpringBootApplication
SpringApplication.run() 方法。

查看run()方法的实现，如下面代码所示，我们发现其实其首先是创建了 SpringApplication 的实例，然后调用了 SpringApplication 的run()方法。

::: warning 小提示
SpringBoot 首先要从 <code>SpringApplication.run(Application.class, args);</code>开始**深入**
:::

```java   

public SpringApplication(ResourceLoader resourceLoader, Class<?>... primarySources) {
		this.resourceLoader = resourceLoader;
		Assert.notNull(primarySources, "PrimarySources must not be null");
       
		this.primarySources = new LinkedHashSet<>(Arrays.asList(primarySources));
        //推断应用类型，后面会根据类型初始化对应的环境。常用的一般都是servlet环境		
        this.webApplicationType = deduceWebApplicationType();
		
        //初始化classpath下 META-INF/spring.factories中已配置的ApplicationContextInitializer
         setInitializers((Collection) getSpringFactoriesInstances(
				ApplicationContextInitializer.class));
        //初始化classpath下所有已配置的 ApplicationListener 
		setListeners((Collection) getSpringFactoriesInstances(ApplicationListener.class));
        //根据调用栈，推断出 main 方法的类名
		this.mainApplicationClass = deduceMainApplicationClass();
	}

```

　初始化classpath下 META-INF/spring.factories中已配置的ApplicationContextInitializer。
```java   
private <T> Collection<T> getSpringFactoriesInstances(Class<T> type) {
    return getSpringFactoriesInstances(type, new Class<?>[]{});
}

/**
 * 通过指定的classloader 从META-INF/spring.factories获取指定的Spring的工厂实例
 * @param type
 * @param parameterTypes
 * @param args
 * @param <T>
 * @return
 */
private <T> Collection<T> getSpringFactoriesInstances(Class<T> type,
                                                      Class<?>[] parameterTypes, Object... args) {
    ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
    // Use names and ensure unique to protect against duplicates
    //通过指定的classLoader从 META-INF/spring.factories 的资源文件中，
    //读取 key 为 type.getName() 的 value
    Set<String> names = new LinkedHashSet<>(SpringFactoriesLoader.loadFactoryNames(type, classLoader));
    //创建Spring工厂实例
    List<T> instances = createSpringFactoriesInstances(type, parameterTypes,
            classLoader, args, names);
    //对Spring工厂实例排序（org.springframework.core.annotation.Order注解指定的顺序）
    AnnotationAwareOrderComparator.sort(instances);
    return instances;
}

```