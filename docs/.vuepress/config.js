// docs/.vuepress/config.js
const pluginConf = require('../config/pluginConf.js');
const urlPattern = require('./utils/urlPattern');
const routers = require('./constant/routers');
const navConstants = require('./constant/NavConstants');


module.exports = {//添加标题和搜索框功能
    title: 'Samdoc',
    description: '各种技术，拥有仅有',//
    base: '/xiaomingwang.github.io/',
    port: 9090,
    head: [
        ['link', {rel: 'icon', href: '/img/logo.png'}],
        ['link', {rel: 'manifest', href: '/manifest.json'}],
    ],
    plugins: pluginConf,
    themeConfig: {
        logo: "/img/logo.png",
        activeHeaderLinks: true,
        nav: [
            {text: '首页', link: '/'},
            {
                text: '学习总结',
                link: '/home/'

            },
            {
                text: '在线文档',
                items: navConstants.navJson.onlinedocsItems
            },
            {
                text: '在线工具',
                items: navConstants.navJson.onlinetoolItems
            },
            {text: '关于作者', link: '/about/'},
            {text: '留言板', link: '/massage/'},
            {
                text: '链接',
                items: [
                    {text: 'GitHub', link: 'https://github.com/XiaomingWangX'},
                    {text: '码云', link: 'https://gitee.com/samxwang'},
                ]
            }
        ],
        lastUpdated: '最后更新时间: ',
        sidebar:
            {

                "/about/": [
                    {
                        title: '关于',
                        path: '/about/',
                        collapsable: true, // 可选的, 默认值是 true,
                        sidebarDepth: 2    // 可选的, 默认值是 1
                    },
                ],
                "/massage/": [
                    {
                        title: '留言板',
                        path: '/massage/',
                        collapsable: true, // 可选的, 默认值是 true,
                        sidebarDepth: 2    // 可选的, 默认值是 1
                    },
                ],
                "/backendtechnology/java/": [],
                "/backendtechnology/microservice/": [

                ],
                "/home/": [

                    {
                        title: "后端栈",
                        path: '/home/',
                        collapsable: true, // 可选的, 默认值是 true,
                        sidebarDepth: 2,    // 可选的, 默认值是 1
                        children: [
                            {
                                title: 'JAVA',
                                path: '/home/backendtechnology/java/',
                                collapsable: true, // 可选的, 默认值是 true,
                                sidebarDepth: 2,    // 可选的, 默认值是 1
                                children: urlPattern.pattern(routers.java, '/home/backendtechnology/java/')
                            },
                            {
                                title: 'JVM',
                                path: '/home/backendtechnology/jvm/',
                                collapsable: true, // 可选的, 默认值是 true,
                                sidebarDepth: 2,    // 可选的, 默认值是 1
                                children: urlPattern.pattern(routers.jvm, '/home/backendtechnology/jvm/')
                            },
                            {
                                title: '微服务',
                                path: '/home/backendtechnology/microservice/',
                                collapsable: true, // 可选的, 默认值是 true,
                                sidebarDepth: 2,    // 可选的, 默认值是 1
                                children: urlPattern.pattern(routers.microservice, '/home/backendtechnology/microservice/')
                            },
                            {
                                title: 'redis',
                                path: '/home/backendtechnology/redis/',
                                collapsable: true, // 可选的, 默认值是 true,
                                sidebarDepth: 2,    // 可选的, 默认值是 1
                                children: urlPattern.pattern(routers.redis, '/home/backendtechnology/redis/')
                            },
                            {
                                title: 'Spring',
                                path: '/home/backendtechnology/frame/',
                                collapsable: true, // 可选的, 默认值是 true,
                                sidebarDepth: 2,    // 可选的, 默认值是 1
                                children: urlPattern.pattern(routers.spring, '/home/backendtechnology/frame/spring/')
                            },
                            {
                                title: 'es',
                                path: '/home/backendtechnology/es/',
                                collapsable: true, // 可选的, 默认值是 true,
                                sidebarDepth: 2,    // 可选的, 默认值是 1
                                children: urlPattern.pattern(routers.es, '/home/backendtechnology/es/')
                            },
                            {
                                title: '数据库',
                                path: '/home/backendtechnology/database/',
                                collapsable: true, // 可选的, 默认值是 true,
                                sidebarDepth: 2,    // 可选的, 默认值是 1
                                children: urlPattern.pattern(routers.database, '/home/backendtechnology/database/')
                            },
                            {
                                title: '并发编程',
                                path: '/home/backendtechnology/current/',
                                collapsable: true, // 可选的, 默认值是 true,
                                sidebarDepth: 2,    // 可选的, 默认值是 1
                                children: urlPattern.pattern(routers.current, '/home/backendtechnology/current/')
                            },
                            {
                                title: '部署',
                                path: '/home/backendtechnology/deploy/',
                                collapsable: true, // 可选的, 默认值是 true,
                                sidebarDepth: 2,    // 可选的, 默认值是 1
                                children: urlPattern.pattern(routers.deploy, '/home/backendtechnology/deploy/')
                            },
                            {
                                title: '平台即服务',
                                path: '/home/backendtechnology/deploy/deployplatform/',
                                collapsable: true, // 可选的, 默认值是 true,
                                sidebarDepth: 2,    // 可选的, 默认值是 1
                                children: urlPattern.pattern(routers.deployplatform, '/home/backendtechnology/deploy/deployplatform/')
                            },
                            {
                                title: 'Docker安装',
                                path: '/home/backendtechnology/deploy/dockerinstall/',
                                collapsable: true, // 可选的, 默认值是 true,
                                sidebarDepth: 2,    // 可选的, 默认值是 1
                                children: urlPattern.pattern(routers.dockerinstall, '/home/backendtechnology/deploy/dockerinstall/')
                            },

                            {
                                title: '设计模式',
                                path: '/home/backendtechnology/design/',
                                collapsable: true, // 可选的, 默认值是 true,
                                sidebarDepth: 2,    // 可选的, 默认值是 1
                                children: urlPattern.pattern(routers.design, '/home/backendtechnology/design/')
                            }
                            ,
                            {
                                title: '数据结构算法',
                                path: '/home/backendtechnology/datastructure/',
                                collapsable: true, // 可选的, 默认值是 true,
                                sidebarDepth: 2,    // 可选的, 默认值是 1
                                children: urlPattern.pattern(routers.datastructure, '/home/backendtechnology/datastructure/')
                            },
                            {
                                title: '流媒体',
                                path: '/home/backendtechnology/video/',
                                collapsable: true, // 可选的, 默认值是 true,
                                sidebarDepth: 2,    // 可选的, 默认值是 1
                                children: urlPattern.pattern(routers.video, '/home/backendtechnology/video/')
                            }
                        ]
                    },
                    /*{
                        title: "前端栈",
                        path: '/home/',
                        collapsable: true, // 可选的, 默认值是 true,
                        sidebarDepth: 2,    // 可选的, 默认值是 1
                        children:[
                            {
                                title: 'Vue指南',
                                path: '/home/fronttechnology/vue/',
                                collapsable: true, // 可选的, 默认值是 true,
                                sidebarDepth: 2,    // 可选的, 默认值是 1
                                children: urlPattern.pattern(routers.vue, '/home/fronttechnology/vue/')
                            },
                            {
                                title: 'Vue官方文档个人阅读',
                                path: '/home/fronttechnology/vue/ownstudy/',
                                collapsable: true, // 可选的, 默认值是 true,
                                sidebarDepth: 2,    // 可选的, 默认值是 1
                                children: urlPattern.pattern(routers.ownstudy, '/home/fronttechnology/vue/ownstudy/')
                            },
                            {
                                title: 'Javascript指南',
                                path: '/home/fronttechnology/javascript/',
                                collapsable: true, // 可选的, 默认值是 true,
                                sidebarDepth: 2,    // 可选的, 默认值是 1
                                children: urlPattern.pattern(routers.javascript, '/home/fronttechnology/javascript/')
                            }

                        ]
                    },*/
                    {
                        title: "运维等拓展",
                        path: '/home/',
                        collapsable: true, // 可选的, 默认值是 true,
                        sidebarDepth: 2,    // 可选的, 默认值是 1
                        sidebar: false,
                        children:[
                            {
                                title: '技术拓展',
                                path: '/home/openuphorizons/other/',
                                collapsable: true, // 可选的, 默认值是 true,
                                sidebarDepth: 2,    // 可选的, 默认值是 1
                                children: urlPattern.pattern(routers.other, '/home/openuphorizons/other/')
                            },
                            {
                                title: '技术陷阱',
                                path: '/home/openuphorizons/trap/',
                                collapsable: true, // 可选的, 默认值是 true,
                                sidebarDepth: 2,    // 可选的, 默认值是 1
                                children: urlPattern.pattern(routers.trap, '/home/openuphorizons/trap/')
                            },
                            {
                                title: '面试宝典',
                                path: '/home/openuphorizons/interview/',
                                collapsable: true, // 可选的, 默认值是 true,
                                sidebarDepth: 2,    // 可选的, 默认值是 1
                                children: urlPattern.pattern(routers.interview, '/home/openuphorizons/interview/')
                            }
                        ]
                    },

                ],
            }
        ,
        displayAllHeaders: false,// 默认值：false
        sidebarDepth: 2,
        // 假定 GitHub。也可以是一个完整的 GitLab URL。
        repo: 'XiaomingWangX/vueBlog',
        // 自定义项目仓库链接文字
        // 默认根据 `themeConfig.repo` 中的 URL 来自动匹配是 "GitHub"/"GitLab"/"Bitbucket" 中的哪个，如果不设置时是 "Source"。
        repoLabel: '贡献代码！',

        // 以下为可选的 "Edit this page" 链接选项

        // 如果你的文档和项目位于不同仓库：
        docsRepo: 'XiaomingWangX/vueBlog',
        // 如果你的文档不在仓库的根目录下：
        docsDir: 'docs',
        // 如果你的文档在某个特定的分支（默认是 'master' 分支）：
        docsBranch: 'dev',
        // 默认为 false，设置为 true 来启用
        editLink: false,
        // 自定义编辑链接的文本。默认是 "Edit this page"
        editLinkText: '帮我改进页面内容！',

    },
    locales: {
        // 键名是该语言所属的子路径
        // 作为特例，默认语言可以使用 '/' 作为其路径。
        '/': {
            lang: 'zh-CN', // 将会被设置为 <html> 的 lang 属性
            title: 'SamDoc',
            description: '有道无术术尚可求，有术无道止于术'
        }
    },
    extraWatchFiles: [
        './config.js', // 使用相对路径
    ],
    markdown: {
        // markdown-it-anchor 的选项
        anchor: {permalink: false},
        // markdown-it-toc 的选项
        toc: {includeLevel: [1, 2]},
        extendMarkdown: md => {
            // 使用更多的 markdown-it 插件!
            // md.use(require('markdown-it-xxx'))
        },
        lineNumbers: true
    }
}

