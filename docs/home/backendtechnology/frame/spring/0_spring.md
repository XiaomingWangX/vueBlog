---
title: spring
---
摘抄自 https://aobing.blog.csdn.net/article/details/110383213  主要是自己做个记录没事自己在理一理.有点难

## 启动流程(源码解析)

### 初始化流程

因为是基于 java-config 技术分析源码，所以这里的入口是 <font color=#A52A2A size=4 >AnnotationConfigApplicationContext</font>
①：如果我想生成 bean 对象，那么就需要一个 beanFactory 工厂（DefaultListableBeanFactory）；

②：如果我想对加了特定注解（如 @Service、@Repository）的类进行读取转化成 BeanDefinition 对象（BeanDefinition 是 Spring 中极其重要的一个概念，它存储了 bean 对象的所有特征信息，如是否单例，是否懒加载，factoryBeanName 等），那么就需要一个注解配置读取器（AnnotatedBeanDefinitionReader）；

③：如果我想对用户指定的包目录进行扫描查找 bean 对象，那么还需要一个路径扫描器（ClassPathBeanDefinitionScanner）。


![spring1.png](/img/spring/spring-1.png) 


### 核心代码剖析



org.springframework.context.annotation.AnnotationConfigUtils#registerAnnotationConfigProcessors

代码运行到这里时候，Spring 容器已经构造完毕，那么就可以为容器添加一些内置组件了，其中最主要的组件便是 ConfigurationClassPostProcessor 和 AutowiredAnnotationBeanPostProcessor ，
前者是一个 beanFactory 后置处理器，用来完成 bean 的扫描与注入工作，
后者是一个 bean 后置处理器，用来完成 @AutoWired 自动注入。

```java
public static Set<BeanDefinitionHolder> registerAnnotationConfigProcessors(BeanDefinitionRegistry registry, Object source) {
        DefaultListableBeanFactory beanFactory = unwrapDefaultListableBeanFactory(registry);
        if (beanFactory != null) {
            if (!(beanFactory.getDependencyComparator() instanceof AnnotationAwareOrderComparator)) {
                beanFactory.setDependencyComparator(AnnotationAwareOrderComparator.INSTANCE);
            }

            if (!(beanFactory.getAutowireCandidateResolver() instanceof ContextAnnotationAutowireCandidateResolver)) {
                beanFactory.setAutowireCandidateResolver(new ContextAnnotationAutowireCandidateResolver());
            }
        }

        Set<BeanDefinitionHolder> beanDefs = new LinkedHashSet(4);
        RootBeanDefinition def;
        if (!registry.containsBeanDefinition("org.springframework.context.annotation.internalConfigurationAnnotationProcessor")) {
            def = new RootBeanDefinition(ConfigurationClassPostProcessor.class);
            def.setSource(source);
            beanDefs.add(registerPostProcessor(registry, def, "org.springframework.context.annotation.internalConfigurationAnnotationProcessor"));
        }

        if (!registry.containsBeanDefinition("org.springframework.context.annotation.internalAutowiredAnnotationProcessor")) {
            def = new RootBeanDefinition(AutowiredAnnotationBeanPostProcessor.class);
            def.setSource(source);
            beanDefs.add(registerPostProcessor(registry, def, "org.springframework.context.annotation.internalAutowiredAnnotationProcessor"));
        }

        if (!registry.containsBeanDefinition("org.springframework.context.annotation.internalRequiredAnnotationProcessor")) {
            def = new RootBeanDefinition(RequiredAnnotationBeanPostProcessor.class);
            def.setSource(source);
            beanDefs.add(registerPostProcessor(registry, def, "org.springframework.context.annotation.internalRequiredAnnotationProcessor"));
        }

        if (jsr250Present && !registry.containsBeanDefinition("org.springframework.context.annotation.internalCommonAnnotationProcessor")) {
            def = new RootBeanDefinition(CommonAnnotationBeanPostProcessor.class);
            def.setSource(source);
            beanDefs.add(registerPostProcessor(registry, def, "org.springframework.context.annotation.internalCommonAnnotationProcessor"));
        }

        if (jpaPresent && !registry.containsBeanDefinition("org.springframework.context.annotation.internalPersistenceAnnotationProcessor")) {
            def = new RootBeanDefinition();

            try {
                def.setBeanClass(ClassUtils.forName("org.springframework.orm.jpa.support.PersistenceAnnotationBeanPostProcessor", AnnotationConfigUtils.class.getClassLoader()));
            } catch (ClassNotFoundException var6) {
                throw new IllegalStateException("Cannot load optional framework class: org.springframework.orm.jpa.support.PersistenceAnnotationBeanPostProcessor", var6);
            }

            def.setSource(source);
            beanDefs.add(registerPostProcessor(registry, def, "org.springframework.context.annotation.internalPersistenceAnnotationProcessor"));
        }

        if (!registry.containsBeanDefinition("org.springframework.context.event.internalEventListenerProcessor")) {
            def = new RootBeanDefinition(EventListenerMethodProcessor.class);
            def.setSource(source);
            beanDefs.add(registerPostProcessor(registry, def, "org.springframework.context.event.internalEventListenerProcessor"));
        }

        if (!registry.containsBeanDefinition("org.springframework.context.event.internalEventListenerFactory")) {
            def = new RootBeanDefinition(DefaultEventListenerFactory.class);
            def.setSource(source);
            beanDefs.add(registerPostProcessor(registry, def, "org.springframework.context.event.internalEventListenerFactory"));
        }

        return beanDefs;
    }


```

org.springframework.context.annotation.AnnotatedBeanDefinitionReader#doRegisterBean

```java
<T> void doRegisterBean(Class<T> annotatedClass, @Nullable Supplier<T> instanceSupplier, @Nullable String name,
		@Nullable Class<? extends Annotation>[] qualifiers, BeanDefinitionCustomizer... definitionCustomizers) {
	// 解析传入的配置类，实际上这个方法既可以解析配置类，也可以解析 Spring bean 对象
	AnnotatedGenericBeanDefinition abd = new AnnotatedGenericBeanDefinition(annotatedClass);
	// 判断是否需要跳过，判断依据是此类上有没有 @Conditional 注解
	if (this.conditionEvaluator.shouldSkip(abd.getMetadata())) {
		return;
	}

	abd.setInstanceSupplier(instanceSupplier);
	ScopeMetadata scopeMetadata = this.scopeMetadataResolver.resolveScopeMetadata(abd);
	abd.setScope(scopeMetadata.getScopeName());
	String beanName = (name != null ? name : this.beanNameGenerator.generateBeanName(abd, this.registry));
	// 处理类上的通用注解
	AnnotationConfigUtils.processCommonDefinitionAnnotations(abd);
	if (qualifiers != null) {
		for (Class<? extends Annotation> qualifier : qualifiers) {
			if (Primary.class == qualifier) {
				abd.setPrimary(true);
			}
			else if (Lazy.class == qualifier) {
				abd.setLazyInit(true);
			}
			else {
				abd.addQualifier(new AutowireCandidateQualifier(qualifier));
			}
		}
	}
	// 封装成一个 BeanDefinitionHolder
	for (BeanDefinitionCustomizer customizer : definitionCustomizers) {
		customizer.customize(abd);
	}
	BeanDefinitionHolder definitionHolder = new BeanDefinitionHolder(abd, beanName);
	// 处理 scopedProxyMode
	definitionHolder = AnnotationConfigUtils.applyScopedProxyMode(scopeMetadata, definitionHolder, this.registry);

	// 把 BeanDefinitionHolder 注册到 registry
	BeanDefinitionReaderUtils.registerBeanDefinition(definitionHolder, this.registry);
}



```

看完流程图，我们也先思考一下：在 3.1 中我们知道了如何去初始化一个 IOC 容器，那么接下来就是让这个 IOC 容器真正起作用的时候了：即先扫描出要放入容器的 bean，将其包装成 BeanDefinition 对象，

然后通过反射创建 bean，并完成赋值操作，这个就是 IOC 容器最简单的功能了。但是看完上图，明显 Spring 的初始化过程比这个多的多，下面我们就详细分析一下这样设计的意图：

如果用户想在扫描完 bean 之后做一些自定义的操作：假设容器中包含了 a 和 b，那么就动态向容器中注入 c，不满足就注入 d，这种骚操作 Spring 也是支持的，

得益于它提供的 BeanFactoryPostProcessor 后置处理器，对应的是上图中的 invokeBeanFactoryPostProcessors 操作。

如果用户还想在 bean 的初始化前后做一些操作呢？比如生成代理对象，修改对象属性等，Spring 为我们提供了 BeanPostProcessor 后置处理器，

实际上 Spring 容器中的大多数功能都是通过 Bean 后置处理器完成的，Spring 也是给我们提供了添加入口，对应的是上图中的 registerBeanPostProcessors 操作。

整个容器创建过程中，如果用户想监听容器启动、刷新等事件，根据这些事件做一些自定义的操作呢？Spring 也早已为我们考虑到了，提供了添加监听器接口和容器事件通知接口

，对应的是上图中的 registerListeners 操作。



### 核心refresh 方法分析
org.springframework.context.support.AbstractApplicationContext#refresh

这个方法是对上图中的具体代码实现，可划分为12个步骤，其中比较重要的步骤下面会有详细说明。

在这里，我们需要记住：Spring 中的每一个容器都会调用 refresh 方法进行刷新，

无论是 Spring 的父子容器，还是 Spring Cloud Feign 中的 feign 隔离容器，每一个容器都会调用这个方法完成初始化。

```java

public void refresh() throws BeansException, IllegalStateException {
	synchronized (this.startupShutdownMonitor) {
		// Prepare this context for refreshing.
		// 1. 刷新前的预处理
		prepareRefresh();

		// Tell the subclass to refresh the internal bean factory.
		// 2. 获取 beanFactory，即前面创建的【DefaultListableBeanFactory】
		ConfigurableListableBeanFactory beanFactory = obtainFreshBeanFactory();

		// Prepare the bean factory for use in this context.
		// 3. 预处理 beanFactory，向容器中添加一些组件
		prepareBeanFactory(beanFactory);

		try {
			// Allows post-processing of the bean factory in context subclasses.
			// 4. 子类通过重写这个方法可以在 BeanFactory 创建并与准备完成以后做进一步的设置
			postProcessBeanFactory(beanFactory);

			// Invoke factory processors registered as beans in the context.
			// 5. 执行 BeanFactoryPostProcessor 方法，beanFactory 后置处理器
			invokeBeanFactoryPostProcessors(beanFactory);

			// Register bean processors that intercept bean creation.
			// 6. 注册 BeanPostProcessors，bean 后置处理器
			registerBeanPostProcessors(beanFactory);

			// Initialize message source for this context.
			// 7. 初始化 MessageSource 组件（做国际化功能；消息绑定，消息解析）
			initMessageSource();

			// Initialize event multicaster for this context.
			// 8. 初始化事件派发器，在注册监听器时会用到
			initApplicationEventMulticaster();

			// Initialize other special beans in specific context subclasses.
			// 9. 留给子容器（子类），子类重写这个方法，在容器刷新的时候可以自定义逻辑，web 场景下会使用
			onRefresh();

			// Check for listener beans and register them.
			// 10. 注册监听器，派发之前步骤产生的一些事件（可能没有）
			registerListeners();

			// Instantiate all remaining (non-lazy-init) singletons.
			// 11. 初始化所有的非单实例 bean
			finishBeanFactoryInitialization(beanFactory);

			// Last step: publish corresponding event.
			// 12. 发布容器刷新完成事件
			finishRefresh();
		}

		...
		
	}
}


```
![spring2.png](/img/spring/spring-2.jfif) 

org.springframework.context.support.AbstractApplicationContext#prepareBeanFactory

顾名思义，这个接口是为 beanFactory 工厂添加一些内置组件，预处理过程。


```java
protected void prepareBeanFactory(ConfigurableListableBeanFactory beanFactory) {
	// Tell the internal bean factory to use the context's class loader etc.
	// 设置 classLoader
	beanFactory.setBeanClassLoader(getClassLoader());
	//设置 bean 表达式解析器
	beanFactory.setBeanExpressionResolver(new StandardBeanExpressionResolver(beanFactory.getBeanClassLoader()));
	beanFactory.addPropertyEditorRegistrar(new ResourceEditorRegistrar(this, getEnvironment()));

	// Configure the bean factory with context callbacks.
	// 添加一个 BeanPostProcessor【ApplicationContextAwareProcessor】
	beanFactory.addBeanPostProcessor(new ApplicationContextAwareProcessor(this));

	// 设置忽略自动装配的接口，即不能通过注解自动注入
	beanFactory.ignoreDependencyInterface(EnvironmentAware.class);
	beanFactory.ignoreDependencyInterface(EmbeddedValueResolverAware.class);
	beanFactory.ignoreDependencyInterface(ResourceLoaderAware.class);
	beanFactory.ignoreDependencyInterface(ApplicationEventPublisherAware.class);
	beanFactory.ignoreDependencyInterface(MessageSourceAware.class);
	beanFactory.ignoreDependencyInterface(ApplicationContextAware.class);

	// BeanFactory interface not registered as resolvable type in a plain factory.
	// MessageSource registered (and found for autowiring) as a bean.
	// 注册可以解析的自动装配类，即可以在任意组件中通过注解自动注入
	beanFactory.registerResolvableDependency(BeanFactory.class, beanFactory);
	beanFactory.registerResolvableDependency(ResourceLoader.class, this);
	beanFactory.registerResolvableDependency(ApplicationEventPublisher.class, this);
	beanFactory.registerResolvableDependency(ApplicationContext.class, this);

	// Register early post-processor for detecting inner beans as ApplicationListeners.
	// 添加一个 BeanPostProcessor【ApplicationListenerDetector】
	beanFactory.addBeanPostProcessor(new ApplicationListenerDetector(this));

	// Detect a LoadTimeWeaver and prepare for weaving, if found.
	// 添加编译时的 AspectJ
	if (beanFactory.containsBean(LOAD_TIME_WEAVER_BEAN_NAME)) {
		beanFactory.addBeanPostProcessor(new LoadTimeWeaverAwareProcessor(beanFactory));
		// Set a temporary ClassLoader for type matching.
		beanFactory.setTempClassLoader(new ContextTypeMatchClassLoader(beanFactory.getBeanClassLoader()));
	}

	// Register default environment beans.
	// 注册 environment 组件，类型是【ConfigurableEnvironment】
	if (!beanFactory.containsLocalBean(ENVIRONMENT_BEAN_NAME)) {
		beanFactory.registerSingleton(ENVIRONMENT_BEAN_NAME, getEnvironment());
	}
	// 注册 systemProperties 组件，类型是【Map<String, Object>】
	if (!beanFactory.containsLocalBean(SYSTEM_PROPERTIES_BEAN_NAME)) {
		beanFactory.registerSingleton(SYSTEM_PROPERTIES_BEAN_NAME, getEnvironment().getSystemProperties());
	}
	// 注册 systemEnvironment 组件，类型是【Map<String, Object>】
	if (!beanFactory.containsLocalBean(SYSTEM_ENVIRONMENT_BEAN_NAME)) {
		beanFactory.registerSingleton(SYSTEM_ENVIRONMENT_BEAN_NAME, getEnvironment().getSystemEnvironment());
	}
}


```

太长啦  看原博主的吧  我在研究下 哈哈哈哈哈