# squoosh-compress

<a href="https://www.npmjs.com/package/squoosh-compress"><img src="https://img.shields.io/npm/v/squoosh-compress.svg" alt="Version"></a>

## 安装
```
npm i squoosh-compress --save
```

## 用法

```
compress(options).then((res) => {})
```

### compress options data

| name           | type   | default | description |
|----------------|--------|---------|-------------|
| image          | File   | none    | 图片文件必传      |
| encodeData     | object | none    | 转化参数必传      |
| sourceFilename | string | none    | 图片文件名称必传    |

### encodeData 

| name    | type   | default | description                                               |
|---------|--------|---------|-----------------------------------------------------------|
| type    | string | none    | 转换图片的类型必传（browser\-png \| browser\-jpeg \| browser\-webp） |
| options | object | none    | 转换的额外参数（type为browser\-png时非必传）                          |


### options

| name    | type   | default | description |
|---------|--------|---------|-------------|
| quality | number | none    | 转换质量        |


### for example：
```
import { compress } from 'squoosh-compress';

const data = await compress(
    file,
    {
      type: "browser-png",
    },
    file.name
);

const data2 = await window.compress.compress(
    file,
    {
      type: "browser-jpeg",
       options: {
         quality: 0.75
       }
    },
    file.name
  );
```
