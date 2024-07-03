// https://fonts.google.com/variablefonts 여기에서 Fonts를 찾아서 추가합니다.
import { Nanum_Gothic, Press_Start_2P } from "next/font/google";

// Font의 classnames를 합치는 공통 함수
const sumClass = (...classnames: string[]) => {
  return classnames.join(" ");
};

// noto_sans_kr에 Noto_Sans_KR 적용
const nanum_gothic = Nanum_Gothic({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--nanum_gothic",
  display: "swap",
});

// single_day에 Single_Day 적용
const press_start_2p = Press_Start_2P({
  weight: ["400"],
  variable: "--press_start_2p",
  display: "swap",
});

// 폰트가 추가되면 여기에 ,(콤마)로 구분하여 추가함 - 외부에서 FontClassNames를 불러와 적용함
export const FontClassNames = sumClass(
  nanum_gothic.className,
  press_start_2p.variable
);
