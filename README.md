<p align="center">
  <img src="/logo.gif" height="300" />
</p>
<p align="center">
  Obsidian Chevereto Image Uploader
</p>
<p align="center">
  <a href="https://github.com/kkzzhizhou/obsidian-chevereto-image-uploader/blob/main/LICENSE"><img alt="GitHub" src="https://img.shields.io/github/license/kkzzhizhou/obsidian-chevereto-image-uploader?style=flat-square"/></a>
  <a href="https://github.com/kkzzhizhou/obsidian-chevereto-image-uploader"><img alt="GitHub" src="https://img.shields.io/badge/Readme--Style-standard--repository-brightgreen?style=flat-square&color=f83500"/></a>
  <a href="https://github.com/kkzzhizhou/obsidian-chevereto-image-uploader"><img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/kkzzhizhou/obsidian-chevereto-image-uploader?style=flat-square"/></a>
  <a href="https://github.com/kkzzhizhou"><img alt="GitHub user" src="https://img.shields.io/badge/author-kkzzhizhou-brightgreen?style=flat-square"/></a>
</p>


## 国际化

[简体中文](README.md) | [English](README.en-US.md)


## 介绍

能够将剪贴板的图片在粘贴到Obsidian时上传至chevereto，并支持上传时调整图像大小。

## 新手入门

### 设置

1. Api Endpoint: Chevereto API链接, 示例：https://your_domain/api/1/upload
2. Chevereto API Token: Chevereto API令牌, 获取方法：https://your_domian/dashboard/settings/api
3. Enable Resize: 是否开启上传前大小调整
4. Max Width: 调整最大宽度，示例：4096

### FAQ

按Ctrl+Shift+i打开Obsidian开发者控制台时，上传时提示CORS跨域，解决方法，在nginx反代时开启CORS支持

```nginx
...(省略)
    location / {
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
        add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
...(省略)
```

## 特别感谢

1. [gavvvr/obsidian-imgur-plugin](https://github.com/gavvvr/obsidian-imgur-plugin)
2. [create-obsidian-plugin](https://www.npmjs.com/package/create-obsidian-plugin)
3. [Creling/obsidian-image-uploader](https://github.com/Creling/obsidian-image-uploader)
4. [jordanhandy/obsidian-cloudinary-uploader](https://github.com/jordanhandy/obsidian-cloudinary-uploader)