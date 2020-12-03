---
title: 流媒体服务器演进
---


## 背景

在直播系统或者视频会议系统中，有 三大件 构成：

推流器——采集、编码、协议封包
流媒体服务器——协议解包封包、转发
播放器——协议解包、解码、渲染

## 流媒体服务器 1.0
FCS，全称 Flash Communication Server
后来的 FMS（全称 Flash Media Server）现在叫 AMS（Adobe Media Server）基本的架构没有变化。（FCS、AMS 后面统称 FMS）
![/img/video/live1.0.png](/img/video/live1.0.png)

在这个架构一下面，推流和播放都由 FlashPlayer 承担，FlashPlayer 可以嵌入到网页中，也可以做成独立的 exe。
后来官方专门制作了一款用于推流的软件 FMLE（全称：Flash Media Live Encoder）。
这 FlashPlayer 和 FMS 之间通过 RTMP 协议进行通讯，这个协议一直到现在还在广泛使用（虽然 Flash 已经被淘汰）。
在 FMS 端还可以通过编写服务器脚本进行业务逻辑开发，可以非常方便的实现房间里面的状态同步，这个得益于 RTMP 协议可以传输一些 AS（action script）的指令，包括 RPC、共享对象等。
当然如今 RTMP 人们只是用来传输音视频，其他功能都已经被忽略了。

## 流媒体服务器 1.5


由于 FMS 的授权费用相当昂贵，当时一个核心 4000 美金，很多企业都承担不起，尤其是创业型公司。
随后就催生出了开源的流媒体服务器，其中最著名的是 Red5，由 Java 开发。
以及性能更为强悍的 crtmpserver（又名 rtmpd）由 C++ 开发。当然这些服务器的功能是不如 FMS 的。
基本的结构是一模一样的，就是 socket 部分采用了 C#的非阻塞异步 Socket，然后对象做了池化。

## 流媒体服务器 2.0

随着 Flash 被封杀，原有的依靠 Flash Player 作为直播的工具被迫下岗。新的技术被不断开发出来，最终形成了百花齐放的局面（其实也是被逼出来的）。
![/img/video/live2.0.png](/img/video/live2.0.png)

RTMP:需要flash rtmp开头的协议 延迟比较低
HLS: 苹果的 延迟很高,最低也得10秒起步 不需要flash  .m3u8结尾
WebRTC :谷歌的 延迟低 不需要flash  播放器插件需要的多  需要浏览器版本比较高

其中安防领域基本都是 RTSP 协议为主，现在逐步形成了 GB28181 标准。网页端由于苹果的影响力，HLS 被广泛采用，不过这个协议最大的缺点是延迟很高，适合观看一些视频节目。DASH 协议是最新的替代 HLS 的方案，增加了更多的功能，不过暂时还没有 HLS 那么流行。谷歌的 WebRTC 发展了多年，由于兼容问题导致流行度没有 HLS 高，但技术更为先进，未来会是非常好的方向。为了追求低延迟我在 2016 年开始研发基于 websocket 的 H5 播放器，现在命名为 Jessibuca（未开源），不久之后 Flv.js 开始支持 ws-flv 协议。（与 flv.js 不同的是 Jessibuca 的渲染方式是 wasm 解码后通过 webgl 渲染到 canvas 上，flv 采用的是 MSE——Media Source Extension），还有一些开源项目也是类似 Flv.js, 只不过是其他协议 over websocket 随着移动互联网的兴起，大量手机端 app 开始进入直播领域，由于 APP 可以完全采用私有协议传播所以可以很好的防止视频的泄漏。

那么流媒体服务器又变成了怎样的呢？由于众多的协议需要得到支持，原来的只支持 rtmp 协议的流媒体服务器自然无法胜任，于是很多流媒体服务器开始接入更多的传输协议。我当时为了能很好的接入 WebSocket 协议，就选择了 MonaServer 作为基础进行改写。这个服务器前身是 CumulusServer?，而 CumulusServer? 的前身叫 OpenRTMFP。

说起 OpenRTMFP，就不得不说 Flash 的一个 RTMFP 协议，这个协议可以使用 P2P 的传输模式，极大的减少服务器的带宽损耗，所以当时我研究了一番，不过由于 FlashPlayer 并没有开源，即便破解了 RTMFP 协议，也无法替代 FlashPlayer 作为播放器。而且由于众所周知的原因，P2P 逐步的离开了人们的视线。

MonaServer 相比 crtmpserver，采用了更先进的 C++11 标准，代码看上去更加现代，然而 C++ 的内存需要开发者自己管理，所以好死不死的我改写的服务器出现了内存泄漏问题。排查了一段时间后，发现了更好用的服务器 SRS，并且提供了一个用 go 写的小程序，可以将 SRS 提供 http-flv 协议转换成 ws-flv 协议。用了一段时间后，就希望少一层转换。于是尝试修改 SRS 源码，不过由于 C++ 功力太浅，就放弃了。但是看到这个 go 的程序写的十分的简洁，几行代码就能实现协议转换，不由被震惊了。当时 Go 语言刚刚兴起，在很短的时间内，就出现了用 Go 开发的流媒体服务器，比如 livego，gortmp 等，（后来还了解到了 joy4）于是尝试采用修改 gortmp 的方式来使用 websocket 协议，修改十分顺利。