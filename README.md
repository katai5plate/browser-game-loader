# browser-game-loader

A launcher that launches a browser game in a local environment. (For a specific cluster)

## Usage for developer

```
npm i
npm run setup
```

### ビルド方法

- 上記手順を終えた状態の `./nw/` を zip にして配布。
  - nw.js は MIT ライセンスなので再配布しても問題ないはず...

### nw.js をバージョンアップする時

- package.json のバージョン情報を書き換える。
  - `setupNW:download-sdk` の `https://dl.nwjs.io/{ この部分 }/nwjs-sdk-v0.51.2-win-x64.zip`
  - `setupLibs:license__nwjs` の `https://raw.githubusercontent.com/nwjs/nw.js/{ この部分 }/LICENSE`

## TODO

- [ ] zip をドラッグ＆ドロップすると解凍するようにする。
- [ ] index.html の場所を探し、bgl.json を作成してデータを記録する
- [ ] ゲームフォルダの package.json に応じて画面サイズを変更できるようにする。
- [ ] DevTools の呼び出し許可を切り替えられるようにする。
  - package.json で `"chromium-args": "--disable-devtools"` することで無効化できる模様。
  - `(w=>w.on("devtools-opened",()=>w.closeDevTools()))(require('nw.gui').Window.get())` っていう手もある。
- [ ] 内部の txt, md, html ファイル ( 可能なら pdf も ) をビューワーとして読めるようにする。
  - [ ] 設定でビューワー対象から除外するファイルをワイルドカードか正規表現で指定できるようにする。
- 動作対象
  - [ ] ツクール MV
  - [ ] ツクール MZ
  - [ ] Phaser
  - [ ] phina.js
  - [ ] p5.js
  - [ ] Unity WEBGL
- 対象外
  - ツクール 2000 / 2003
    - EasyRPG 使うと GPL-3.0 License に変更する必要がある。ライセンス的に面倒なのでナシ。

## USE-CASE

### 1.0.0 目標

1. \_game に zip を入れる
2. ツールを起動する
3. zip が自動で展開され、分析データが出力される
4. 分析済みのゲームがリストアップされる
5. 「ゲームスタート」を押すと別窓でゲームが起動する
6. 「ビューワー」を押すと別窓で `*.txt` ファイル一覧が表示され、それぞれ読むことが出来る

## MEMO

- NW.js の NORMAL と SDK の違い
  - 削除 (NORMAL から削除しても普通に DevTools 開ける模様)
    - pnacl/
    - chromedriver.exe
    - nacl_irt_x86_64.nexe
    - nwjc.exe
    - payload.exe
  - 変更
    - swiftshader/
    - ffmpeg.dll
    - libEGL.dll
    - libEGLESv2.dll
    - node.dll
    - notification_helper.exe
    - nw_elf.dll
    - nw.dll
    - nw.exe
    - resources.pak
- GPL-3.0 License `>=` Apache License 2.0
  - GPLv3 はコピーレフト（継承/ソース公開）、ALv2 は違う
    - CC BY-SA 4.0 とも互換性がある
  - ライセンス表記は両方ごっちゃにしていいが、GPLv3 を使う場合継承する
  - [ALv2 の説明はここが分かりやすかった](https://yamory.io/blog/about-mit-License/#apache-license%2C-version-2.0%EF%BC%88apache-license-2.0%EF%BC%89)
