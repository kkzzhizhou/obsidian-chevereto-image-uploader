# Obsidian Chevereto Image Uploader

This plugin could resize(optional) and upload the image in your clipboard to chevereto when pasting.

## Getting started

### Settings

1. Api Endpoint: the Endpoint of the image hosting api.
2. Chevereto API Token: the API token of the chevereto.
3. Enable Resize: whether resizing images before uploading.
4. Max Width: images that wider than this will be resized resized by the natural aspect ratio.

PS：if chevereto is proxy by web server like nginx, web server should enable cors. nginx example as follow:

```
    location / {
        add_header 'Access-Control-Allow-Origin' "$http_origin";
        add_header 'Access-Control-Allow-Credentials' 'true';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';
        ... other params ...
    }
```

## Thanks
1. [obsidian-imgur-plugin](https://github.com/gavvvr/obsidian-imgur-plugin)
2. [create-obsidian-plugin](https://www.npmjs.com/package/create-obsidian-plugin)
3. [obsidian-image-uploader](https://github.com/Creling/obsidian-image-uploader)