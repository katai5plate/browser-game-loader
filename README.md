# browser-game-loader

A launcher that launches a browser game in a local environment. (For a specific cluster)

## Usage for developer

```
npm i
npm run setup
npm start
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
  - WEB 系ゲーム
    - ツクール MV/MZ
      - [ ] ツクール MV
      - [ ] ツクール MZ
    - [ ] Unity WEBGL
    - その他
      - [ ] Node.js 系
      - [ ] HTML 全般
  - EXE 系ゲーム
    - [ ] ツクール 2000/2003
    - [ ] ツクール XP/VX/VXAce
    - [ ] Unity
    - [ ] HSP
    - [ ] ウディタ
    - [ ] その他

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
- Fooks を導入して、JSON を DB 代わりにやり取りするシステムにしたほうが良さそう
- 各 type 判定方法 (デフォルトタイトルはフォルダ名から)
  - "Web"
    - index.html がある (タイトルは title タグから)
    - "Node.js"
      - package.json がある
      - RPG ツクール以外のエンジンは判別しない
      - "RPG MV/MZ"
        - data/System.json がある (タイトルは gameTitle の値から)
        - "RPG MV"
          - data/System.json に advanced がない
        - "RPG MZ"
          - data/System.json に advanced がある
    - "Unity WebGL"
      - `<div id="unity-container" class="unity-desktop">` がある
  - "RPG 2K/2K3"
    - RPG_RT.ini がある (タイトルは GameTitle の値から)
    - 2K と 2K3 を判別する方法はわからず。
  - "Executable"
    - 1 つでも exe ファイルがある (タイトルは 1 つめの exe のファイル名から)
    - "RPG XP/VX/VXAce"
      - Game.ini がある (タイトルは Title の値から)
    - "Wolf RPG"
      - Config.exe がある
      - タイトルは Data/BasicData/Game.dat のバイナリ中に、 `09 00 00 00` の後 4 バイト分で指定された長さの -1 だけ、後述されている。
        - 例えば `09 00 00 00 | 07 00 00 00 | 88 d9 90 a2 8a 45` だったら `異世界` になる。
        - [詳細...](http://kameske027.php.xdomain.jp/analysis_woditor.php)
    - "Unity"
      - UnityEngine.dll がある
    - "HSP"
      - 1 つめの exe のバイナリ中に `48 53 50 45 52 52 4f` (HSPERROR) がある
