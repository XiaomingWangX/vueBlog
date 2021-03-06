---
title: Docker 镜像加速器
---

国内从 Docker Hub 拉取镜像有时会遇到困难，此时可以配置镜像加速器。Docker 官方和国内很多云服务商都提供了国内加速器服务，例如：

 * [Docker 官方提供的中国 registry mirror](https://docs.docker.com/registry/recipes/mirror/#use-case-the-china-registry-mirror)   
 * [阿里云加速器](https://cr.console.aliyun.com/#/accelerator)   
 * [DaoCloud 加速器](https://www.daocloud.io/mirror#accelerator-doc)    
 
 我们以 Docker 官方加速器为例进行介绍。
 
 ## Ubuntu 14.04、Debian 7 Wheezy
 对于使用 [upstart](http://upstart.ubuntu.com/) 的系统而言，编辑 <code>/etc/default/docker</code> 文件，在其中的 DOCKER_OPTS 中配置加速器地址：
 ```sh  
 DOCKER_OPTS="--registry-mirror=https://registry.docker-cn.com"
 ```
 重新启动服务。
 ```sh 
 $ sudo service docker restart
 ```
 ## Ubuntu 16.04+、Debian 8+、CentOS 7
 对于使用 [systemd](https://www.freedesktop.org/wiki/Software/systemd/) 的系统，请在 <code>/etc/docker/daemon.json </code>中写入如下内容（如果文件不存在请新建该文件）
```sh  
{
  "registry-mirrors": [
    "https://registry.docker-cn.com"
  ]
}
```
::: warning 警告
注意，一定要保证该文件符合 json 规范，否则 Docker 将不能启动。
:::
之后重新启动服务。
 
 ```sh 
 $ sudo systemctl daemon-reload
 $ sudo systemctl restart docker
 ```
 ## 检查加速器是否生效
    配置加速器之后，如果拉取镜像仍然十分缓慢，请手动检查加速器配置是否生效，在命令行执行 docker info，如果从结果中看到了如下内容，说明配置成功。
```sh  
    
    Registry Mirrors:
     https://registry.docker-cn.com/
```