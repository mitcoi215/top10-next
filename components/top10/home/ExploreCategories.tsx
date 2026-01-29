'use client';

import { useState } from 'react';

// Arrow icon SVG
const ArrowIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="100" viewBox="0 0 10 8" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M8.83333 0.916504L10 2.08317L5 7.08317L0 2.08317L1.16667 0.916504L5 4.74984L8.83333 0.916504Z"></path>
  </svg>
);

// Category icons - exact SVGs from original
const LifestyleIcon = () => (
  <svg width="26" height="28" viewBox="0 0 26 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M24.8914 18.4355L20.7428 16.0139L19.0564 11.4066C18.7932 10.6855 18.2546 10.0984 17.5589 9.77412L14.8606 8.52955V7.27148H11.5451V8.51606L8.84685 9.76063C8.15072 10.0881 7.61494 10.6809 7.35943 11.4066L5.67302 16.0273L1.53456 18.4355C1.02992 18.7473 0.853528 19.397 1.1312 19.9212C1.40886 20.4454 2.04545 20.6645 2.58688 20.4221L7.09973 18.2635L9.18413 13.6832C9.18413 13.6832 10.1218 18.5131 8.3443 21.0697L13.2113 22.655L18.0817 21.0697C16.3042 18.5131 17.2418 13.6832 17.2418 13.6832L19.3229 18.2635L23.8391 20.4221C24.3805 20.6645 25.0171 20.4454 25.2948 19.9212C25.5724 19.397 25.396 18.7473 24.8914 18.4355Z" fill="#FFC9D0" stroke="#FE4A64"></path>
    <path d="M13.2112 7.71346C15.0833 7.71346 16.6009 6.19585 16.6009 4.32377C16.6009 2.4517 15.0833 0.934082 13.2112 0.934082C11.3391 0.934082 9.82153 2.4517 9.82153 4.32377C9.82153 6.19585 11.3391 7.71346 13.2112 7.71346Z" fill="#FFE5E9" stroke="#FE4A64"></path>
    <path d="M16.6145 23.1307C16.3036 22.7629 15.789 22.6411 15.3463 22.8305L14.8269 23.0565L7.2751 20.601C6.49502 20.3401 5.63908 20.6644 5.22779 21.3768C4.97051 21.851 4.95565 22.4197 5.18781 22.9067C5.41997 23.3937 5.87113 23.7402 6.40154 23.839L16.0208 25.9605C15.9991 26.4704 16.3386 26.9255 16.8337 27.0499C17.259 27.1566 17.7065 26.9937 17.9636 26.6384C18.3977 26.0369 18.3685 25.2176 17.8928 24.6484L16.6145 23.1307Z" fill="#FFC9D0" stroke="#FE4A64"></path>
    <path d="M9.81162 23.1306C10.1224 22.7603 10.6396 22.6382 11.0832 22.8304L11.6026 23.0564L19.151 20.601C19.9321 20.3354 20.7919 20.6606 21.2017 21.3767C21.4589 21.8505 21.4742 22.4186 21.2428 22.9055C21.0113 23.3924 20.5611 23.7393 20.0313 23.8389L10.4052 25.9604C10.43 26.4702 10.091 26.9264 9.59576 27.0498C9.17042 27.1565 8.72296 26.9936 8.46586 26.6383C8.0293 26.0376 8.05852 25.2166 8.53669 24.6484L9.81162 23.1306Z" fill="#FFC9D0" stroke="#FE4A64"></path>
  </svg>
);

const BusinessIcon = () => (
  <svg width="27" height="24" viewBox="0 0 27 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24.807 10.8279V21.6884C24.807 21.9764 24.6926 22.2526 24.4889 22.4563C24.2852 22.66 24.009 22.7744 23.721 22.7744H3.08605C2.79801 22.7744 2.52177 22.66 2.3181 22.4563C2.11442 22.2526 2 21.9764 2 21.6884V11.9139" fill="#FFC9D0"></path>
    <path d="M24.807 10.8279V21.6884C24.807 21.9764 24.6926 22.2526 24.4889 22.4563C24.2852 22.66 24.009 22.7744 23.721 22.7744H3.08605C2.79801 22.7744 2.52177 22.66 2.3181 22.4563C2.11442 22.2526 2 21.9764 2 21.6884V11.9139" stroke="#FE4A64"></path>
    <path d="M15.6739 14.457L26 12.1748V5.55957C26 5.26716 25.8855 4.98672 25.6816 4.77996C25.4778 4.57319 25.2013 4.45703 24.913 4.45703H2.08696C1.79868 4.45703 1.52221 4.57319 1.31836 4.77996C1.11452 4.98672 1 5.26716 1 5.55957V12.1748L11.3261 14.457" fill="#FFC9D0"></path>
    <path d="M15.6739 14.457L26 12.1748V5.55957C26 5.26716 25.8855 4.98672 25.6816 4.77996C25.4778 4.57319 25.2013 4.45703 24.913 4.45703H2.08696C1.79868 4.45703 1.52221 4.57319 1.31836 4.77996C1.11452 4.98672 1 5.26716 1 5.55957V12.1748L11.3261 14.457" stroke="#FE4A64"></path>
    <path d="M17 13H11V16.2581H17V13Z" fill="#FDE3E7" stroke="#FE4A64" strokeLinejoin="round"></path>
    <path d="M8.66669 4.80117V3.1721C8.66669 2.59602 8.89553 2.04354 9.30288 1.63619C9.71023 1.22885 10.2627 1 10.8388 1H15.1178C15.6939 1 16.2464 1.22885 16.6537 1.63619C17.0611 2.04354 17.2899 2.59602 17.2899 3.1721V4.80117" stroke="#FE4A64"></path>
  </svg>
);

const FoodIcon = () => (
  <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.9755 13.0112L10.292 16.2706L5.7079 11.6924C2.86683 8.85129 1.80361 4.08712 4.06368 1.81543L14.5623 12.3315C14.4016 12.586 14.2038 12.8151 13.9755 13.0112V13.0112ZM25.3572 23.1264L16.9327 14.7019L16.6422 14.4347C16.3881 14.5935 16.159 14.7893 15.9625 15.0157L13.0575 18.2925C13.2768 18.2479 13.4785 18.141 13.6385 17.9845L14.7366 16.8865L21.9351 26.5659C22.3912 27.0196 23.0089 27.2737 23.6523 27.272C23.9709 27.2712 24.2862 27.2077 24.5802 27.085C24.8742 26.9624 25.1412 26.783 25.3659 26.5571C25.5906 26.3313 25.7686 26.0634 25.8898 25.7688C26.0109 25.4741 26.0729 25.1585 26.0721 24.8399C26.0713 24.5214 26.0077 24.2061 25.8851 23.9121C25.7624 23.618 25.583 23.3511 25.3572 23.1264V23.1264Z" fill="#FFC9D0" stroke="#FF4A64" strokeLinecap="round" strokeLinejoin="round"></path>
    <path d="M23.0332 12.5462C22.6028 12.9777 22.091 13.3196 21.5275 13.552C20.9641 13.7843 20.3601 13.9026 19.7506 13.8999C17.6241 13.8999 16.7991 14.1148 15.9973 15.0212L5.08623 27.3383C4.62754 27.7715 4.01795 28.0087 3.3871 27.9994C2.75625 27.9901 2.1539 27.7351 1.70816 27.2886C1.26241 26.8421 1.00842 26.2393 1.00021 25.6084C0.991991 24.9776 1.2302 24.3684 1.66417 23.9104L13.9755 13.011C14.8818 12.2092 15.0968 11.3842 15.0968 9.25772C15.0958 8.02748 15.5826 6.84703 16.4505 5.9751V5.9751L23.0332 12.5462Z" fill="#FFE5E9" stroke="#FF4A64" strokeLinecap="round" strokeLinejoin="round"></path>
    <path d="M21.3382 1.00008L16.4099 5.93164L16.4921 6.01378L21.4204 1.08222L21.3382 1.00008Z" stroke="#FF4A64" strokeLinecap="round" strokeLinejoin="round"></path>
    <path d="M27.9179 7.57532L22.9862 12.5034L23.0683 12.5856L28.0001 7.65751L27.9179 7.57532Z" stroke="#FF4A64" strokeLinecap="round" strokeLinejoin="round"></path>
    <path d="M25.7277 5.38689L20.7979 10.3169L20.88 10.3991L25.8098 5.46905L25.7277 5.38689Z" stroke="#FF4A64" strokeLinecap="round" strokeLinejoin="round"></path>
    <path d="M23.5326 3.19486L18.6024 8.12451L18.6846 8.20667L23.6148 3.27702L23.5326 3.19486Z" stroke="#FF4A64" strokeLinecap="round" strokeLinejoin="round"></path>
  </svg>
);

const LoveIcon = () => (
  <svg width="33" height="25" viewBox="0 0 33 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.0038 17.3146L13.3202 16.8046C7.34727 15.007 3.40513 13.8226 2.01813 10.9542C0.887976 8.61709 2.00148 5.96029 4.54881 4.91604C5.98789 4.32612 7.66628 4.37456 9.03745 4.97629C9.46927 3.63545 10.5532 2.45462 11.9923 1.86469C14.5396 0.820447 17.4291 1.8363 18.5592 4.17345C19.9463 7.04176 18.2644 10.5316 15.7223 15.8289L15.0038 17.3146Z" fill="#FFC9D0" stroke="#FF4A64"></path>
    <path d="M21.8454 21.156L21.6087 20.1112C20.7613 16.4085 20.2008 13.9653 21.5118 12.304C22.58 10.9503 24.5786 10.6622 26.054 11.6491C26.8876 12.2067 27.4066 13.0978 27.4849 14.0097C28.4509 13.7964 29.5319 13.9755 30.3654 14.5331C31.8409 15.52 32.1608 17.3591 31.0926 18.7128C29.7816 20.3741 27.0846 20.6383 22.9944 21.0449L21.8454 21.156Z" fill="#FFE6E9" stroke="#FF4A64"></path>
  </svg>
);

const TechIcon = () => (
  <svg width="35" height="26" viewBox="0 0 35 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M12.765 21.5457L13.4416 19.8956L12.3938 19.4583C12.5794 18.6744 12.5794 17.8579 12.3938 17.074L13.4498 16.645L12.7815 14.9949L11.7337 15.4239C11.3223 14.7398 10.7574 14.1608 10.0837 13.7326L10.5292 12.6848L8.8791 12L8.43358 13.0478C7.64916 12.8663 6.83365 12.8663 6.04922 13.0478L5.62021 12L3.97013 12.66L4.39915 13.7078C3.73535 14.1309 3.17216 14.6941 2.74908 15.3579L1.70128 14.9206L1.02475 16.5707L2.07255 17.008C1.89104 17.7924 1.89104 18.6079 2.07255 19.3923L1 19.8543L1.66003 21.5044L2.71608 21.0754C3.12753 21.7595 3.69243 22.3385 4.36615 22.7667L3.92063 23.8145L5.5707 24.4993L6.01622 23.4515C6.80065 23.633 7.61616 23.633 8.40058 23.4515L8.7966 24.4993L10.4467 23.8393L10.0177 22.7915C10.6815 22.3684 11.2446 21.8052 11.6677 21.1414L12.765 21.5457Z" fill="#FFC9D0" stroke="#FE4A64" strokeLinecap="round" strokeLinejoin="round"></path>
    <path fillRule="evenodd" clipRule="evenodd" d="M9.98452 19.4322C9.34636 20.9529 7.59646 21.6685 6.07562 21.0308C4.55478 20.393 3.83866 18.6433 4.47596 17.1223C5.11326 15.6013 6.86275 14.8847 8.38395 15.5215C9.11502 15.8276 9.69445 16.4117 9.99466 17.1452C10.2949 17.8787 10.2912 18.7014 9.98452 19.4322V19.4322Z" fill="#FFE5E9" stroke="#FE4A64" strokeLinecap="round" strokeLinejoin="round"></path>
    <path fillRule="evenodd" clipRule="evenodd" d="M7.90579 18.2776C7.90579 18.6512 7.6029 18.9541 7.22926 18.9541C6.85563 18.9541 6.55273 18.6512 6.55273 18.2776C6.55273 17.904 6.85563 17.6011 7.22926 17.6011C7.6029 17.6011 7.90579 17.904 7.90579 18.2776V18.2776Z" stroke="#FE4A64" strokeLinecap="round" strokeLinejoin="round"></path>
    <path fillRule="evenodd" clipRule="evenodd" d="M31.161 14.6617L31.2509 12.0936L29.6115 12.0306C29.4702 10.8788 29.0609 9.77654 28.4163 8.81163L29.6326 7.70099L27.8997 5.80966L26.6946 6.91615C25.794 6.19969 24.7381 5.70228 23.6103 5.46322L23.689 3.82446L21.1092 3.73039L21.0306 5.36915C19.8764 5.51888 18.7711 5.92928 17.7988 6.56908L16.6921 5.37043L14.7865 7.09189L15.8932 8.29054C15.2055 9.19576 14.7245 10.2395 14.4838 11.3486L12.8444 11.2856L12.7546 13.8537L14.3939 13.9167C14.5411 15.067 14.9499 16.168 15.5891 17.1356L14.367 18.2991L16.0887 20.1946L17.305 19.084C18.2056 19.8004 19.2615 20.2978 20.3893 20.5369L20.3107 22.1757L22.8904 22.2697L22.9691 20.631C24.1232 20.4812 25.2286 20.0708 26.2008 19.431L27.2628 20.6463L29.1684 18.9248L28.0617 17.7262C28.7494 16.821 29.2304 15.7772 29.4711 14.6681L31.161 14.6617Z" fill="#FFC9D0" stroke="#FE4A64" strokeLinecap="round" strokeLinejoin="round"></path>
    <path fillRule="evenodd" clipRule="evenodd" d="M26.333 13.2079C26.2302 15.582 24.2171 17.4287 21.8361 17.3331C19.4551 17.2376 17.6075 15.2358 17.7088 12.8617C17.8102 10.4875 19.8222 8.63965 22.2033 8.73389C23.3476 8.77918 24.4257 9.27611 25.2003 10.1153C25.9749 10.9544 26.3823 12.067 26.333 13.2079V13.2079Z" fill="#FFE5E9" stroke="#FE4A64" strokeLinecap="round" strokeLinejoin="round"></path>
    <path fillRule="evenodd" clipRule="evenodd" d="M22.9367 12.6951C23.124 13.1995 22.8653 13.7608 22.3589 13.9488C21.8524 14.1369 21.2901 13.8804 21.1028 13.376C20.9155 12.8716 21.1742 12.3102 21.6806 12.1222C22.1871 11.9341 22.7494 12.1906 22.9367 12.6951V12.6951Z" stroke="#FE4A64" strokeLinecap="round" strokeLinejoin="round"></path>
  </svg>
);

const EntertainmentIcon = () => (
  <svg width="21" height="30" viewBox="0 0 21 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M19.5857 1.97819V24.4767C19.5857 27.1779 17.3959 29.3676 14.6947 29.3676H1.97819C1.43795 29.3676 1 28.9297 1 28.3894V1.97819C1 1.43795 1.43795 1 1.97819 1H18.6075C19.1477 1 19.5857 1.43795 19.5857 1.97819Z" fill="#FFC9D0" stroke="#FE4A64" strokeLinecap="round" strokeLinejoin="round"></path>
    <path d="M15.6729 20.5638C16.2131 20.5638 16.6511 20.1259 16.6511 19.5856C16.6511 19.0454 16.2131 18.6074 15.6729 18.6074C15.1327 18.6074 14.6947 19.0454 14.6947 19.5856C14.6947 20.1259 15.1327 20.5638 15.6729 20.5638Z" stroke="#FE4A64" strokeLinecap="round" strokeLinejoin="round"></path>
    <path d="M12.7383 23.4984C13.2786 23.4984 13.7165 23.0604 13.7165 22.5202C13.7165 21.9799 13.2786 21.542 12.7383 21.542C12.1981 21.542 11.7601 21.9799 11.7601 22.5202C11.7601 23.0604 12.1981 23.4984 12.7383 23.4984Z" stroke="#FE4A64" strokeLinecap="round" strokeLinejoin="round"></path>
    <path d="M16.6511 3.93457H3.93457V14.6947H16.6511V3.93457Z" fill="#FFE5E9" stroke="#FE4A64" strokeLinecap="round" strokeLinejoin="round"></path>
    <path d="M7.01099 26.2912L7.7055 25.5967" stroke="#FE4A64" strokeLinecap="round" strokeLinejoin="round"></path>
    <path d="M9.94556 26.2912L10.6401 25.5967" stroke="#FE4A64" strokeLinecap="round" strokeLinejoin="round"></path>
    <path d="M3.93457 20.564H7.84734" stroke="#FE4A64" strokeLinecap="round" strokeLinejoin="round"></path>
    <path d="M5.89099 22.5202V18.6074" stroke="#FE4A64" strokeLinecap="round" strokeLinejoin="round"></path>
  </svg>
);

const ShoppingIcon = () => (
  <svg width="34" height="28" viewBox="0 0 34 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.5001 6.18384L24.5001 6.18369L29.2579 6.18375L32.2926 6.31598L32.6695 6.81846L28.8348 19.5986H12.2265L8.23975 6.31598L17.2645 6.18375L21.5001 6.18384Z" fill="#FFC9D0"></path>
    <path d="M1 1.00009H6.28926C6.37392 0.998268 6.4568 1.02452 6.52497 1.07476C6.59315 1.12499 6.64277 1.19637 6.66611 1.27777L12.2397 19.5984H28.8347L32.6694 6.81827C32.687 6.75974 32.6906 6.6979 32.68 6.63772C32.6693 6.57754 32.6446 6.52071 32.6079 6.47181C32.5713 6.42291 32.5236 6.38332 32.4688 6.35622C32.4141 6.32912 32.3537 6.31527 32.2926 6.31579H8.27273" stroke="#FE4A64" strokeLinecap="round" strokeLinejoin="round"></path>
    <path d="M13.2181 26.9109C14.5035 26.9109 15.5454 25.8689 15.5454 24.5836C15.5454 23.2983 14.5035 22.2563 13.2181 22.2563C11.9328 22.2563 10.8909 23.2983 10.8909 24.5836C10.8909 25.8689 11.9328 26.9109 13.2181 26.9109Z" fill="#FDE3E7" stroke="#FE4A64"></path>
    <path d="M27.5057 26.9109C28.7911 26.9109 29.833 25.8689 29.833 24.5836C29.833 23.2983 28.7911 22.2563 27.5057 22.2563C26.2204 22.2563 25.1785 23.2983 25.1785 24.5836C25.1785 25.8689 26.2204 26.9109 27.5057 26.9109Z" fill="#FDE3E7" stroke="#FE4A64"></path>
    <path d="M14.8645 22.9241H25.8794" stroke="#FE4A64"></path>
    <path d="M9.39673 10.3027H31.5984" stroke="#FE4A64"></path>
    <path d="M10.7786 14.8381H30.2232" stroke="#FE4A64"></path>
    <path d="M14.2231 6.18359L17.8992 19.5985" stroke="#FE4A64"></path>
    <path d="M23.5256 19.5985L26.8447 6.177" stroke="#FE4A64"></path>
  </svg>
);

const HomePrivacyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M4.69296 8.12373V2.30895C4.69296 2.0945 4.86681 1.92065 5.08126 1.92065H7.9935C8.20796 1.92065 8.3818 2.0945 8.3818 2.30895V4.56885" fill="#FFC9D0"></path>
    <path d="M4.69296 8.12373V2.30895C4.69296 2.0945 4.86681 1.92065 5.08126 1.92065H7.9935C8.20796 1.92065 8.3818 2.0945 8.3818 2.30895V4.56885" stroke="#FE4A64"></path>
    <path fillRule="evenodd" clipRule="evenodd" d="M1.38668 12.4134C1.23013 12.4127 1.0893 12.3181 1.02948 12.1735C0.969659 12.0288 1.00256 11.8623 1.11293 11.7513L11.7504 1.11388C11.8232 1.04097 11.922 1 12.0251 1C12.1282 1 12.227 1.04097 12.2998 1.11388L22.9373 11.7513C23.0476 11.8623 23.0805 12.0288 23.0207 12.1735C22.9609 12.3181 22.8201 12.4127 22.6635 12.4134H20.3337V23.0217C20.3337 23.2362 20.1599 23.41 19.9454 23.41H4.10477C3.699 23.41 3.71647 23.0502 3.71647 23.0502V12.4134H1.38668Z" fill="#FFC9D0" stroke="#FE4A64"></path>
    <path fillRule="evenodd" clipRule="evenodd" d="M8.93808 23.0263V15.509C8.93808 15.2898 9.10475 15.1121 9.31035 15.1121H14.7399C14.9455 15.1121 15.1121 15.2898 15.1121 15.509V23.0501" fill="#FFE6E9"></path>
    <path d="M8.93808 23.0263V15.509C8.93808 15.2898 9.10475 15.1121 9.31035 15.1121H14.7399C14.9455 15.1121 15.1121 15.2898 15.1121 15.509V23.0501" stroke="#FE4A64"></path>
    <path d="M13.2415 4.93896L17.6759 9.37334" stroke="#FE4A64" strokeLinecap="round"></path>
  </svg>
);

const FamilyPetsIcon = () => (
  <svg width="30" height="31" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="23" y="14" width="5" height="5" fill="#FFC9D0"></rect>
    <path d="M15.8291 14.1514C14.6482 12.7146 12.5127 11.9126 10.6774 11.9126H6.74101C2.66196 11.9126 0.492035 13.6003 0.492035 18.2747V25.5865C0.492035 26.8363 1.53025 28.0468 3.24749 28.0468V29.6902H25.8029V25.5865L27.9383 25.2126C29.193 24.9961 29.7048 24.0563 29.4145 22.7819L27.9826 17.0249" fill="#FFC9D0"></path>
    <path d="M15.8291 14.1514C14.6482 12.7146 12.5127 11.9126 10.6774 11.9126H6.74101C2.66196 11.9126 0.492035 13.6003 0.492035 18.2747V25.5865C0.492035 26.8363 1.53025 28.0468 3.24749 28.0468V29.6902H25.8029V25.5865L27.9383 25.2126C29.193 24.9961 29.7048 24.0563 29.4145 22.7819L27.9826 17.0249" stroke="#FE4A64" strokeWidth="0.8" strokeLinejoin="round"></path>
    <path d="M16.1735 29.6754V25.5865L14.0331 25.2125C12.7784 24.996 12.2667 24.0562 12.5274 22.7818L14.0479 16.6165C14.7416 14.2891 16.5081 13.3838 19.2389 13.3838H22.6833C23.5335 13.3636 24.3813 13.4833 25.1927 13.738" fill="#FFC9D0"></path>
    <path d="M16.1735 29.6754V25.5865L14.0331 25.2125C12.7784 24.996 12.2667 24.0562 12.5274 22.7818L14.0479 16.6165C14.7416 14.2891 16.5081 13.3838 19.2389 13.3838H22.6833C23.5335 13.3636 24.3813 13.4833 25.1927 13.738" stroke="#FE4A64" strokeWidth="0.8" strokeLinejoin="round"></path>
    <path d="M27.3577 17.069C27.8305 17.1098 28.3018 16.9749 28.6813 16.6901C28.8914 16.5295 29.0713 16.3329 29.2127 16.1095C29.9213 15.027 29.2472 14.4562 28.2729 13.5656C27.653 12.9998 27.0625 12.4782 26.5311 12.429C26.4236 12.4187 26.3152 12.4299 26.2121 12.462C26.109 12.4941 26.0134 12.5465 25.9308 12.616C25.7544 12.7758 25.6077 12.9657 25.4978 13.1769C25.1597 13.664 25.0088 14.2568 25.073 14.8463C25.1372 15.4357 25.4121 15.9822 25.8472 16.385C26.2627 16.7716 26.7931 17.0118 27.3577 17.069V17.069Z" fill="#FFC9D0" stroke="#FE4A64" strokeWidth="0.8" strokeLinejoin="round"></path>
    <path d="M20.9857 12.637C21.8355 12.637 22.6662 12.385 23.3727 11.9127C24.0792 11.4405 24.6298 10.7693 24.9547 9.98415C25.2797 9.19896 25.3645 8.33501 25.1983 7.50162C25.0322 6.66823 24.6226 5.90285 24.0214 5.3023C23.4201 4.70175 22.6543 4.29303 21.8207 4.12784C20.9871 3.96265 20.1233 4.04842 19.3384 4.37429C18.5536 4.70017 17.8831 5.25151 17.4117 5.95855C16.9403 6.6656 16.6892 7.49659 16.6901 8.34637C16.6895 8.91043 16.8002 9.46906 17.0159 9.99023C17.2316 10.5114 17.548 10.9849 17.9471 11.3835C18.3462 11.7821 18.82 12.098 19.3415 12.3131C19.8629 12.5282 20.4216 12.6383 20.9857 12.637V12.637Z" fill="#FFC9D0" stroke="#FE4A64" strokeWidth="0.8" strokeLinejoin="round"></path>
    <path d="M8.71409 11.8066C9.62908 11.8076 10.5238 11.5371 11.2851 11.0295C12.0463 10.5219 12.6399 9.79985 12.9907 8.95479C13.3416 8.10972 13.4339 7.17959 13.256 6.28206C13.0781 5.38453 12.6379 4.55993 11.9913 3.91259C11.3446 3.26525 10.5205 2.82425 9.62316 2.64539C8.72582 2.46652 7.79559 2.55783 6.95015 2.90776C6.10471 3.25768 5.38206 3.85051 4.87362 4.61123C4.36517 5.37195 4.09378 6.26639 4.09378 7.18138C4.09314 7.78854 4.21217 8.38987 4.44407 8.951C4.67597 9.51213 5.0162 10.0221 5.4453 10.4516C5.8744 10.8812 6.38395 11.2219 6.94484 11.4544C7.50572 11.6869 8.10693 11.8066 8.71409 11.8066V11.8066Z" fill="#FFC9D0" stroke="#FE4A64" strokeWidth="0.8" strokeLinejoin="round"></path>
    <path d="M22.0113 20.558L23.6904 25.4425C23.7403 25.5828 23.7617 25.7315 23.7535 25.8802C23.7453 26.0288 23.7076 26.1743 23.6425 26.3081C23.5775 26.442 23.4865 26.5616 23.3747 26.66C23.263 26.7583 23.1328 26.8334 22.9918 26.8809C22.7076 26.9765 22.3971 26.9561 22.1279 26.8242C21.8586 26.6923 21.6522 26.4595 21.5534 26.1764C21.5534 26.1764 21.3303 25.5893 21.2716 25.3662C21.1665 24.948 20.9454 24.568 20.6338 24.2699C20.3222 23.9718 19.9328 23.7678 19.5104 23.6813L14.2266 22.6539C14.4203 21.2625 15.9526 18.1333 18.7824 17.3701" fill="#FFE5E9"></path>
    <path d="M22.0113 20.558L23.6904 25.4425C23.7403 25.5828 23.7617 25.7315 23.7535 25.8802C23.7453 26.0288 23.7076 26.1743 23.6425 26.3081C23.5775 26.442 23.4865 26.5616 23.3747 26.66C23.263 26.7583 23.1328 26.8334 22.9918 26.8809C22.7076 26.9765 22.3971 26.9561 22.1279 26.8242C21.8586 26.6923 21.6522 26.4595 21.5534 26.1764C21.5534 26.1764 21.3303 25.5893 21.2716 25.3662C21.1665 24.948 20.9454 24.568 20.6338 24.2699C20.3222 23.9718 19.9328 23.7678 19.5104 23.6813L14.2266 22.6539C14.4203 21.2625 15.9526 18.1333 18.7824 17.3701" stroke="#FE4A64" strokeWidth="0.8" strokeLinejoin="round"></path>
    <path d="M21.2422 14.8041C21.3773 14.8041 21.5123 14.8041 21.6591 14.8041C22.3367 14.797 22.9938 15.0358 23.5088 15.4762C24.0237 15.9167 24.3615 16.5289 24.4595 17.1994C24.6004 18.3208 25.8626 18.2327 25.8391 19.0194C25.8391 20.0233 25.07 20.6456 23.937 20.6456C22.9947 20.6455 22.0534 20.5847 21.119 20.4636C18.7706 19.9411 18.7354 18.2973 18.7706 17.5869C18.7656 17.2848 18.7971 16.9832 18.8646 16.6887" fill="#F3DADE"></path>
    <path d="M21.2422 14.8041C21.3773 14.8041 21.5123 14.8041 21.6591 14.8041C22.3367 14.797 22.9938 15.0358 23.5088 15.4762C24.0237 15.9167 24.3615 16.5289 24.4595 17.1994C24.6004 18.3208 25.8626 18.2327 25.8391 19.0194C25.8391 20.0233 25.07 20.6456 23.937 20.6456C22.9947 20.6455 22.0534 20.5847 21.119 20.4636C18.7706 19.9411 18.7354 18.2973 18.7706 17.5869C18.7656 17.2848 18.7971 16.9832 18.8646 16.6887" stroke="#FE4A64" strokeWidth="0.8" strokeLinejoin="round"></path>
    <path d="M21.4066 18.3388C21.8528 18.239 22.164 17.8515 21.6825 16.8887C21.5358 16.3825 21.5358 15.845 21.6825 15.3388C21.7413 15.057 21.5064 14.7517 20.8489 14.7517C19.6747 14.7517 18.5651 15.4503 18.6884 16.0433C18.9467 17.4464 20.344 18.5854 21.4066 18.3388Z" fill="#F3DADE" stroke="#FE4A64" strokeWidth="0.8" strokeLinejoin="round"></path>
    <line x1="3.68794" y1="29.55" x2="3.68794" y2="20.1052" stroke="#FE4A64" strokeWidth="0.9" strokeLinecap="round"></line>
  </svg>
);

// Tab categories data - exact from original HTML
const tabCategories = [
  { id: 'all', name: 'All', icon: null },
  { id: 'lifestyle', name: 'Lifestyle', icon: LifestyleIcon },
  { id: 'business', name: 'Business', icon: BusinessIcon },
  { id: 'health', name: 'Health Category', icon: null },
  { id: 'food', name: 'Food', icon: FoodIcon },
  { id: 'love', name: 'Love & Relationships', icon: LoveIcon },
  { id: 'tech', name: 'Tech', icon: TechIcon },
  { id: 'entertainment', name: 'Entertainment', icon: EntertainmentIcon },
  { id: 'shopping', name: 'Shopping', icon: ShoppingIcon },
  { id: 'home', name: 'Home & Privacy', icon: HomePrivacyIcon },
  { id: 'family', name: 'Family & Pets', icon: FamilyPetsIcon },
];

// Links data - exact from original HTML
const defaultCategoryLinks = [
  { href: '/medical-alerts-match', title: 'Medical Alerts Match' },
  { href: '/accounting-software', title: 'Accounting Software' },
  { href: '/ad-blockers', title: 'Ad Blockers' },
  { href: '/adventure-travel-companies', title: 'Adventure Travel Companies' },
  { href: '/affordable-art-sites', title: 'Affordable Art Sites' },
  { href: '/air-purifiers', title: 'Air Purifiers' },
  { href: '/allergy-apps', title: 'Allergy Apps' },
  { href: '/android-games', title: 'Android Games' },
  { href: '/android-navigation-apps', title: 'Android Navigation Apps' },
  { href: '/anti-procrastination-apps', title: 'Anti-Procrastination Apps' },
  { href: '/antivirus', title: 'Antivirus' },
  { href: '/apple-tv-apps', title: 'Apple TV Apps' },
  { href: '/apps-for-a-night-out', title: 'Apps for a Night Out' },
  { href: '/apps-for-anxiety', title: 'Apps for Anxiety' },
  { href: '/apps-for-beer-lovers', title: 'Apps For Beer Lovers' },
  { href: '/apps-for-better-sleep', title: 'Apps for Better Sleep' },
  { href: '/apps-for-charitable-giving', title: 'Apps for Charitable Giving' },
  { href: '/apps-for-college-students', title: 'Apps for College Students' },
  { href: '/apps-for-dog-owners', title: 'Apps for Dog Owners' },
  { href: '/apps-for-gluten-free-living', title: 'Apps For Gluten Free Living' },
  { href: '/apps-for-hikers', title: 'Apps for Hikers' },
  { href: '/apps-for-surviving-flu-season', title: 'Apps For Surviving Flu Season' },
  { href: '/apps-for-the-podcast-addict', title: 'Apps for the Podcast Addict' },
  { href: '/apps-for-the-smart-traveler', title: 'Apps for the Smart Traveler' },
  { href: '/apps-for-wine-lovers', title: 'Apps for Wine-Lovers' },
  { href: '/apps-to-curb-smartphone-addiction', title: 'Apps to Curb Smartphone Addiction' },
  { href: '/apps-to-make-you-smarter', title: 'Apps to Make You Smarter' },
  { href: '/ar-games', title: 'AR games' },
  { href: '/automated-investment-services', title: 'Automated Investment Services' },
  { href: '/baby-clothing-websites', title: 'Baby Clothing Websites' },
];

// Types
interface CategoryLink {
  title: string;
  href: string;
}

interface ExploreCategory {
  groupSlug: string;
  groupName: string;
  icon?: string | null;
  links: CategoryLink[];
}

interface ExploreCategoriesProps {
  categories?: ExploreCategory[] | null;
}

export default function ExploreCategories({ categories }: ExploreCategoriesProps) {
  // Get all links from categories, or use defaults
  const categoryLinks = categories && categories.length > 0
    ? categories.flatMap(c => c.links)
    : defaultCategoryLinks;
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="ni-1out05v">
      <div className="ni-10sckbz">
        {/* Separator line */}
        <div className="ni-sqf7nl"></div>

        {/* Title */}
        <h2 className="ni-1vruo6v">Explore Our Categories</h2>

        {/* Tabs container */}
        <div className="ni-bjn8wh">
          {/* Mobile dropdown button */}
          <div className="ni-b0iyz5">
            <div className="ni-8h0oye">
              <ArrowIcon className="ni-9i0bof" />
            </div>
          </div>

          {/* Tab buttons */}
          <div className="ni-1yt1bof">
            {tabCategories.map((cat) => (
              <div key={cat.id} className="ni-11qlfbl">
                <button
                  tabIndex={0}
                  className={activeTab === cat.id ? 'ni-12perco' : 'ni-18un0oq'}
                  onClick={() => setActiveTab(cat.id)}
                >
                  <span className="ni-1s1j2gb">
                    {cat.icon && (
                      <div className="ni-12xuwu1">
                        <cat.icon />
                      </div>
                    )}
                    {cat.name}
                    <ArrowIcon className={activeTab === cat.id ? 'ni-1y64lkc' : 'ni-11b1vgq'} />
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Links grid */}
        <div className="ni-1ej1cqj">
          {categoryLinks.map((link, idx) => (
            <a key={idx} href={link.href} className="ni-5py9el">
              {link.title}
            </a>
          ))}
        </div>

        {/* Show All button */}
        <a tabIndex={0} href="/all-lists" target="_blank" className="ni-1ivybsv">
          <span className="ni-1s1j2gb">Show All</span>
        </a>
      </div>
    </div>
  );
}
