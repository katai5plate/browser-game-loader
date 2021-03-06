type GetProps<C> = C extends (props: infer R) => any ? R : never;

interface GameData {
  folderName: string;
  title: string;
  alias: string;
  isWEB: boolean;
  type: string;
  updatedAt: string;
  playedAt: string;
  width: number;
  height: number;
  icon?: string;
  exec?: {
    path: string;
    name: string;
  };
  screenSize?: {
    width: number;
    height: number;
  };
  files: string[];
  indexHTML: {
    title?: string;
    meta?: { name?: string; [attr: string]: string }[];
    link?: { rel?: string; [attr: string]: string }[];
    script?: {
      type?: string;
      src?: string;
      codeLength?: number;
      [attr: string]: string | number;
    }[];
  };
  packageJSON: {
    name?: string;
    main?: string;
    "js-flags"?: string;
    "chromium-args"?: string;
    window?: {
      title?: string;
      width?: number | string;
      height?: number | string;
      icon?: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
}

type _PluginFile_FileReader = {
  /** ファイルの読み取り方法 */
  type: "HTML" | "JSON" | "TEXT_REGEX";
  /** ファイルパス (スラッシュ区切り・:EXEC_FILE 使用可) */
  file: string;
  /**
   * ### HTML:
   * querySelector のスペース区切り。
   * 末尾要素の文字列先頭に ! をつけた文字列でプロパティ取得。
   * `["head", "title", "!text"]`
   * =>`document.querySelector("head title").text`
   * ### JSON:
   * 要素へのパス。
   * `{ a: { b: [ { { c: false } }, { c: true } ] } }`
   * という JSON の場合、`["a", "b", 1, "c"]` 設定で
   * `true` が取得可能<br/>
   * ### TEXT_REGEX
   * `String.prototype.match` のような挙動。
   * `[ RegExp に入れる文字列, 取得するインデックス ]`。
   * インデックスを 0 にすると全文取得。
   */
  position: string[];
};

type _PluginFile_Analyze = _PluginFile_FileReader & {
  /** 検証 */
  expect: {
    /** 判定方法 */
    method: "IS_TRUTHY"; // 適宜追加する
    /** 結果 */
    result: boolean;
  }[];
};

interface PluginFile {
  /** 判別タイプ名 */
  name: string;
  /** 判別タイプの説明 */
  description: string;
  /** 実行ファイル名 */
  execFile: string | _PluginFile_FileReader;
  /** 特定に必要な情報 */
  test: {
    /** 存在するべきファイル (:EXEC_FILE 使用可) */
    includes: string[];
    /** 存在してはいけないファイル (:EXEC_FILE 使用可) */
    excludes: [];
    /** ファイル構造の解析 */
    analyze: _PluginFile_Analyze[];
  };
  /** ゲームデータに代入する値の取得方法 */
  address: {
    title: _PluginFile_FileReader;
    width: _PluginFile_FileReader;
    height: _PluginFile_FileReader;
    icon: _PluginFile_FileReader;
  };
}
