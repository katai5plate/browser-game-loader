type GetProps<C> = C extends (props: infer R) => any ? R : never;

interface GameData {
  /** 取得されたファイル名 */
  folderName: string;
  /** 取得されたゲームタイトル */
  title: string;
  /** ユーザーが自由に変更可能なゲームタイトル */
  alias?: string;
  /** HTML ゲームか */
  isHTML: boolean;
  /** 取得されたゲームタイプ (プラグインによって選出) */
  type: string;
  /** 更新日時 */
  updatedAt: string;
  /** プレイ日時 */
  playedAt?: string;
  /** 取得された画面の大きさ */
  screenSize?: {
    /** 幅 */
    width: number;
    /** 高さ */
    height: number;
  };
  /** 取得されたアイコンのパス */
  icon?: string;
  /** 実行ファイル情報 */
  exec?: {
    /** パス */
    path: string;
    /** ファイル名 */
    name: string;
  };
  /** 取得されたファイルのリスト */
  files: string[];
}

type _PluginFile_FileReader = {
  /** ファイルの読み取り方法 */
  type: "HTML" | "JSON" | "TEXT_REGEX";
  /** ファイルパス (スラッシュ区切り・:EXEC_FILE 使用可) */
  file: string;
  /**
   * ### HTML:
   * querySelector のスペース区切り。
   * 末尾要素はプロパティ取得。
   * `["head", "title", "text"]`
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
  };
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
    analyze?: _PluginFile_Analyze[];
  };
  /** ゲームデータに代入する値の取得方法 */
  address: {
    title?: _PluginFile_FileReader;
    width?: _PluginFile_FileReader;
    height?: _PluginFile_FileReader;
    icon?: _PluginFile_FileReader;
  };
}
