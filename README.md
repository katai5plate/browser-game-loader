# browser-game-loader

A launcher that launches a browser game in a local environment. (For a specific cluster)

## TODO

- [ ] zip をドラッグ＆ドロップすると解凍するようにする。
- [ ] 解凍したら index.html の場所を探すようにする。
- [ ] ゲームフォルダの package.json に応じて画面サイズを変更できるようにする。
- [ ] DevTools の呼び出し許可を切り替えられるようにする。
  - package.json で `"chromium-args": "--disable-devtools"` することで無効化できる模様。
- [ ] 内部の txt, md, html ファイル ( 可能なら pdf も ) をビューワーとして読めるようにする。
  - [ ] 設定でビューワー対象から除外するファイルをワイルドカードか正規表現で指定できるようにする。
- 動作対象
  - [ ] ツクール MV
  - [ ] ツクール MZ
  - [ ] Phaser
  - [ ] phina.js
  - [ ] p5.js
  - [ ] Unity WEBGL
  - [ ] ツクール 2000 / 2003 (EasyRPG)
    - 実装するとなると、ライセンスを GPL-3.0 License に変更する必要がある。
    - RTP 読めるのかも要確認
    - [ ] 別でダウンロードしてきて使う場合もライセンスを変更する必要があるのか調べたほうがよさそう。

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
