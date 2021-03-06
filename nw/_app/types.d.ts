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
