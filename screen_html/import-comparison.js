/**
 * Import scraped comparison data into the database
 * Usage: Run this in browser console on admin page, or via node with fetch
 *
 * Prerequisites:
 * 1. Products must already exist in the category
 * 2. You need an admin token
 */

const ADMIN_TOKEN = 'YOUR_ADMIN_TOKEN';
const API_BASE = 'http://localhost:3000/api';
const CATEGORY_SLUG = 'home-security';

const scrapedProducts = [
  {
    "position": 1,
    "name": "Vivint",
    "slug": "vivint",
    "logoUrl": "./Top 10 Best Home Security System Providers_files/Product_Vivint2025_Size_300x100-Light-NoBg-20250612-104921.20250612113120.svg",
    "overallScore": 9.9,
    "scoreLabel": "Exceptional",
    "bottomLine": "Advanced equipment and custom-built security systems",
    "ribbon": "Our Top Pick",
    "features": [
      "Get 5 months free with Code: 5FREE",
      "Free 4.6-star smart home app",
      "24/7 continuous video recording",
      "0% APR financing available",
      "Customizable options for every budget"
    ],
    "ctaUrl": "https://www.10rating/v?product_id=1246&url=https%3A%2F%2Ft.vivint.com%2F%3Fc%3D265%26lp%3D332%26s2%3D%5Btracking-subid%5D&rank=1&bi=%7B%22blrs%22%3A94491%2C%22utm_source%22%3A%22Direct%22%7D&comp_iid=ed5e5dd0-97c9-4b74-951c-5df8acbdab77&uid=OhC1Ze8x10YjzV16864n&riid=Vjo0fDw2NZ8xBQ678cpm&tkn=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiY21zIiwidmVyc2lvbiI6MSwiaGFzaCI6InNLOTVoc2c4azRERmR5U0svZGgvSWNpTmY0Yz0iLCJpYXQiOjE3Njk5MzUzOTAsImV4cCI6MTc3MDAyMTc5MH0.XEdDm3fVym8dp7JIt-0tGoPDtCk_l16KJCQmQFpa9bI",
    "ctaText": "Visit Site",
    "secondaryCtaUrl": "https://www.10rating/v?product_id=1246&url=https%3A%2F%2Ft.vivint.com%2F%3Fc%3D265%26lp%3D332%26s2%3D%5Btracking-subid%5D&rank=1&bi=%7B%22blrs%22%3A94491%2C%22utm_source%22%3A%22Direct%22%7D&comp_iid=ed5e5dd0-97c9-4b74-951c-5df8acbdab77&uid=OhC1Ze8x10YjzV16864n&riid=Vjo0fDw2NZ8xBQ678cpm&tkn=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiY21zIiwidmVyc2lvbiI6MSwiaGFzaCI6InNLOTVoc2c4azRERmR5U0svZGgvSWNpTmY0Yz0iLCJpYXQiOjE3Njk5MzUzOTAsImV4cCI6MTc3MDAyMTc5MH0.XEdDm3fVym8dp7JIt-0tGoPDtCk_l16KJCQmQFpa9bI",
    "secondaryCtaText": "Get Protected",
    "reviewCount": 57988,
    "description": null
  },
  {
    "position": 2,
    "name": "ADT",
    "slug": "adt",
    "logoUrl": "./Top 10 Best Home Security System Providers_files/ADT_LogoRGB-12.20240523093040.svg",
    "overallScore": 9.3,
    "scoreLabel": "Excellent",
    "bottomLine": "Leading home security provider with 6+ million customers and 150 years of experience",
    "ribbon": null,
    "features": [
      "Get a $100 ADT Visa Reward Card* with a newly installed system",
      "24/7 professional monitoring with rapid response",
      "6-month money-back guarantee**"
    ],
    "ctaUrl": "https://www.10rating/v?product_id=1204&url=https%3A%2F%2Fwww.10rating%2Fhome-security%2Fadt%3Futm_source%3DPPC_Des%26cid%3D%5Btracking-subid%5D&rank=2&bi=%7B%22blrs%22%3A77969%2C%22utm_source%22%3A%22Direct%22%7D&comp_iid=ed5e5dd0-97c9-4b74-951c-5df8acbdab77&uid=OhC1Ze8x10YjzV16864n&riid=Vjo0fDw2NZ8xBQ678cpm&tkn=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiY21zIiwidmVyc2lvbiI6MSwiaGFzaCI6InNqVWN4cjFnSjFVSzZZY3dGejNVSGQ5K0xiST0iLCJpYXQiOjE3Njk5MzUzOTAsImV4cCI6MTc3MDAyMTc5MH0.RX8DXqrysLRbfs3EQA7qNdpQVf1zpXQF4JmWjrMKusQ",
    "ctaText": "Visit Site",
    "secondaryCtaUrl": "https://www.10rating/v?product_id=1204&url=https%3A%2F%2Fwww.10rating%2Fhome-security%2Fadt%3Futm_source%3DPPC_Des%26cid%3D%5Btracking-subid%5D&rank=2&bi=%7B%22blrs%22%3A77969%2C%22utm_source%22%3A%22Direct%22%7D&comp_iid=ed5e5dd0-97c9-4b74-951c-5df8acbdab77&uid=OhC1Ze8x10YjzV16864n&riid=Vjo0fDw2NZ8xBQ678cpm&tkn=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiY21zIiwidmVyc2lvbiI6MSwiaGFzaCI6InNqVWN4cjFnSjFVSzZZY3dGejNVSGQ5K0xiST0iLCJpYXQiOjE3Njk5MzUzOTAsImV4cCI6MTc3MDAyMTc5MH0.RX8DXqrysLRbfs3EQA7qNdpQVf1zpXQF4JmWjrMKusQ",
    "secondaryCtaText": "Get Free Quote",
    "reviewCount": 4667,
    "description": "*Req. system purchase with min. of $349 for DIY or $599 for pro install & pro\n                    monitoring plan starting at $24.99/mo. w/ 1 mo. min. w/DIY or $34.99 for 36 mo. w/pro install (early\n                    cancel fees). Not available for online orders. Terms & pricing below.\n                  **Applies after ADT has made attempts to resolve a system related issue. Requires purchase and\n                    continual monthly payment of both QSP and professional monitoring at time of activation to be\n                    eligible. See below for terms."
  },
  {
    "position": 3,
    "name": "Brinks Home",
    "slug": "brinks-home",
    "logoUrl": "./Top 10 Best Home Security System Providers_files/large-2023_Logo_BrinksHome.20230918070512.png",
    "overallScore": 8.8,
    "scoreLabel": "Very good",
    "bottomLine": "Tailored security with cutting-edge tech & on-the-go control",
    "ribbon": null,
    "features": [
      "Free video doorbell + free install",
      "24/7 home protection",
      "30-second response time"
    ],
    "ctaUrl": "https://www.10rating/v?product_id=1215&url=https%3A%2F%2Ftrksp1.com%2F%3FE%3DYysxOhqM0HMbEMc1DvZkWlKhF%252fFPCmqPDbfaF54T%252fx8%253d%26s1%3DPPCD%26s2%3DDes_%5Btracking-subid%5D&rank=3&bi=%7B%22blrs%22%3A89621%2C%22utm_source%22%3A%22Direct%22%7D&comp_iid=ed5e5dd0-97c9-4b74-951c-5df8acbdab77&uid=OhC1Ze8x10YjzV16864n&riid=Vjo0fDw2NZ8xBQ678cpm&tkn=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiY21zIiwidmVyc2lvbiI6MSwiaGFzaCI6IjVxcFVCeWZ1UEV0b0hmWEJveHA2YUVNRGdhST0iLCJpYXQiOjE3Njk5MzUzOTAsImV4cCI6MTc3MDAyMTc5MH0.KQiEV-srQ-sq3vXxbWovdPObNS5nVeQU7vdlc3TRESc",
    "ctaText": "Visit Site",
    "secondaryCtaUrl": "https://www.10rating/v?product_id=1215&url=https%3A%2F%2Ftrksp1.com%2F%3FE%3DYysxOhqM0HMbEMc1DvZkWlKhF%252fFPCmqPDbfaF54T%252fx8%253d%26s1%3DPPCD%26s2%3DDes_%5Btracking-subid%5D&rank=3&bi=%7B%22blrs%22%3A89621%2C%22utm_source%22%3A%22Direct%22%7D&comp_iid=ed5e5dd0-97c9-4b74-951c-5df8acbdab77&uid=OhC1Ze8x10YjzV16864n&riid=Vjo0fDw2NZ8xBQ678cpm&tkn=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiY21zIiwidmVyc2lvbiI6MSwiaGFzaCI6IjVxcFVCeWZ1UEV0b0hmWEJveHA2YUVNRGdhST0iLCJpYXQiOjE3Njk5MzUzOTAsImV4cCI6MTc3MDAyMTc5MH0.KQiEV-srQ-sq3vXxbWovdPObNS5nVeQU7vdlc3TRESc",
    "secondaryCtaText": "Get Protected",
    "reviewCount": 7659,
    "description": null
  },
  {
    "position": 4,
    "name": "SimpliSafe",
    "slug": "simplisafe",
    "logoUrl": "./Top 10 Best Home Security System Providers_files/Logo260x100-2022-Sumplisafe.20221026074110.png",
    "overallScore": 9.2,
    "scoreLabel": "Excellent",
    "bottomLine": "Advanced, affordable security and monitoring tech",
    "ribbon": null,
    "features": [
      "Get 50% off + free camera",
      "Money-back guarantee",
      "24/7 monitoring with no contract"
    ],
    "ctaUrl": "https://www.10rating/v?product_id=10565&url=https%3A%2F%2Fsimplisafe.sjv.io%2Fc%2F34020%2F1402420%2F16688%3FsubId1%3D%5Btracking-subid%5D%26subId2%3DPPC%26subId3%3DDT&rank=4&bi=%7B%22blrs%22%3A77063%2C%22utm_source%22%3A%22Direct%22%7D&comp_iid=ed5e5dd0-97c9-4b74-951c-5df8acbdab77&uid=OhC1Ze8x10YjzV16864n&riid=Vjo0fDw2NZ8xBQ678cpm&tkn=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiY21zIiwidmVyc2lvbiI6MSwiaGFzaCI6ImIycGRoNnFYd2svbGZvK0Y4NE1zSGFSTkE3cz0iLCJpYXQiOjE3Njk5MzUzOTAsImV4cCI6MTc3MDAyMTc5MH0.rnR53hy5Kv3ZH8INmO9AplvYTdhxkY3O9XcqeuWpEKI",
    "ctaText": "Visit Site",
    "secondaryCtaUrl": "https://www.10rating/v?product_id=10565&url=https%3A%2F%2Fsimplisafe.sjv.io%2Fc%2F34020%2F1402420%2F16688%3FsubId1%3D%5Btracking-subid%5D%26subId2%3DPPC%26subId3%3DDT&rank=4&bi=%7B%22blrs%22%3A77063%2C%22utm_source%22%3A%22Direct%22%7D&comp_iid=ed5e5dd0-97c9-4b74-951c-5df8acbdab77&uid=OhC1Ze8x10YjzV16864n&riid=Vjo0fDw2NZ8xBQ678cpm&tkn=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiY21zIiwidmVyc2lvbiI6MSwiaGFzaCI6ImIycGRoNnFYd2svbGZvK0Y4NE1zSGFSTkE3cz0iLCJpYXQiOjE3Njk5MzUzOTAsImV4cCI6MTc3MDAyMTc5MH0.rnR53hy5Kv3ZH8INmO9AplvYTdhxkY3O9XcqeuWpEKI",
    "secondaryCtaText": "Get Protected",
    "reviewCount": 16669,
    "description": null
  },
  {
    "position": 5,
    "name": "Cove",
    "slug": "cove",
    "logoUrl": "./Top 10 Best Home Security System Providers_files/Cove-large-UpdatedLovo.20250702141950.png",
    "overallScore": 8.8,
    "scoreLabel": "Very good",
    "bottomLine": "Easy DIY security with affordable prices",
    "ribbon": null,
    "features": [
      "Get 70% OFF + a FREE HD camera",
      "No commitments, no contracts",
      "60-day money-back guarantee"
    ],
    "ctaUrl": "https://www.10rating/v?product_id=11040&url=http%3A%2F%2Fwww.covetrack.com%2FXNFTQ%2F4QJ4X5%2F%3Fuid%3D11%26sub1%3D%5Btracking-subid%5D&rank=5&bi=%7B%22blrs%22%3A65212%2C%22utm_source%22%3A%22Direct%22%7D&comp_iid=ed5e5dd0-97c9-4b74-951c-5df8acbdab77&uid=OhC1Ze8x10YjzV16864n&riid=Vjo0fDw2NZ8xBQ678cpm&tkn=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiY21zIiwidmVyc2lvbiI6MSwiaGFzaCI6IjhtRTQ5WmZ5UVVJaHZoT2dDVWZGRE43eWw0RT0iLCJpYXQiOjE3Njk5MzUzOTAsImV4cCI6MTc3MDAyMTc5MH0.27_VEq8rmjvAYBXQROzwuz3gy7NoSxLcsPu2JikaFB4",
    "ctaText": "Visit Site",
    "secondaryCtaUrl": "https://www.10rating/v?product_id=11040&url=http%3A%2F%2Fwww.covetrack.com%2FXNFTQ%2F4QJ4X5%2F%3Fuid%3D11%26sub1%3D%5Btracking-subid%5D&rank=5&bi=%7B%22blrs%22%3A65212%2C%22utm_source%22%3A%22Direct%22%7D&comp_iid=ed5e5dd0-97c9-4b74-951c-5df8acbdab77&uid=OhC1Ze8x10YjzV16864n&riid=Vjo0fDw2NZ8xBQ678cpm&tkn=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiY21zIiwidmVyc2lvbiI6MSwiaGFzaCI6IjhtRTQ5WmZ5UVVJaHZoT2dDVWZGRE43eWw0RT0iLCJpYXQiOjE3Njk5MzUzOTAsImV4cCI6MTc3MDAyMTc5MH0.27_VEq8rmjvAYBXQROzwuz3gy7NoSxLcsPu2JikaFB4",
    "secondaryCtaText": "Get Protected",
    "reviewCount": 7311,
    "description": null
  },
  {
    "position": 6,
    "name": "ADT DIY",
    "slug": "adt-diy",
    "logoUrl": "./Top 10 Best Home Security System Providers_files/ADTOctagonLogo_Blue_RGB.20240703070014.png",
    "overallScore": 8.3,
    "scoreLabel": "Good",
    "bottomLine": "Sophisticated & customizable DIY security system",
    "ribbon": "Our Top DIY Pick",
    "features": [
      "Cancel anytime",
      "Fast & simple setup",
      "Easy-to-use 4.6-star mobile app"
    ],
    "ctaUrl": "https://www.10rating/v?product_id=11477&url=https%3A%2F%2Fwww.10rating%2Fhome-security%2FADT-Self-Setup%3Futm_source%3DPPC_Des%26cid%3D%5Btracking-subid%5D&rank=6&bi=%7B%22blrs%22%3A77972%2C%22utm_source%22%3A%22Direct%22%7D&comp_iid=ed5e5dd0-97c9-4b74-951c-5df8acbdab77&prepop=blrs%3D77972&uid=OhC1Ze8x10YjzV16864n&riid=Vjo0fDw2NZ8xBQ678cpm&tkn=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiY21zIiwidmVyc2lvbiI6MSwiaGFzaCI6InM0WS8rMWpKOHowOEU4UW1ZSERFakpJZ3FxZz0iLCJpYXQiOjE3Njk5MzUzOTAsImV4cCI6MTc3MDAyMTc5MH0.9s_z0AiCKf66Zf4B1cXPxc0vLAxgdaTfVLrnOby9fqY",
    "ctaText": "Visit Site",
    "secondaryCtaUrl": "https://www.10rating/v?product_id=11477&url=https%3A%2F%2Fwww.10rating%2Fhome-security%2FADT-Self-Setup%3Futm_source%3DPPC_Des%26cid%3D%5Btracking-subid%5D&rank=6&bi=%7B%22blrs%22%3A77972%2C%22utm_source%22%3A%22Direct%22%7D&comp_iid=ed5e5dd0-97c9-4b74-951c-5df8acbdab77&prepop=blrs%3D77972&uid=OhC1Ze8x10YjzV16864n&riid=Vjo0fDw2NZ8xBQ678cpm&tkn=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiY21zIiwidmVyc2lvbiI6MSwiaGFzaCI6InM0WS8rMWpKOHowOEU4UW1ZSERFakpJZ3FxZz0iLCJpYXQiOjE3Njk5MzUzOTAsImV4cCI6MTc3MDAyMTc5MH0.9s_z0AiCKf66Zf4B1cXPxc0vLAxgdaTfVLrnOby9fqY",
    "secondaryCtaText": "Get Protected",
    "reviewCount": 4172,
    "description": null
  },
  {
    "position": 7,
    "name": "Frontpoint Security",
    "slug": "frontpoint-security",
    "logoUrl": "./Top 10 Best Home Security System Providers_files/frontpoint-logo new.20210305071516.png",
    "overallScore": 8.7,
    "scoreLabel": "Very good",
    "bottomLine": "Full activation in under 30 minutes",
    "ribbon": null,
    "features": [
      "Secure your home for up to 82% off",
      "Free quote available",
      "24/7 professional monitoring"
    ],
    "ctaUrl": "https://www.10rating/v?product_id=1225&url=https%3A%2F%2Fwww.frontpointsecurity.com%2Fnimobile%3FAFFILIATE_SUBID%3DDT_%5Btracking-subid%5D&rank=7&bi=%7B%22blrs%22%3A88822%2C%22utm_source%22%3A%22Direct%22%7D&comp_iid=ed5e5dd0-97c9-4b74-951c-5df8acbdab77&uid=OhC1Ze8x10YjzV16864n&riid=Vjo0fDw2NZ8xBQ678cpm&tkn=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiY21zIiwidmVyc2lvbiI6MSwiaGFzaCI6Ik1UUlpwNmxzS2tYbXJSaFc4bnpTSjNvSDdEdz0iLCJpYXQiOjE3Njk5MzUzOTAsImV4cCI6MTc3MDAyMTc5MH0.FGA7uE6SPezT8-Tris0--tSzEl6ecXRRCgcbZopVfSk",
    "ctaText": "Visit Site",
    "secondaryCtaUrl": "https://www.10rating/v?product_id=1225&url=https%3A%2F%2Fwww.frontpointsecurity.com%2Fnimobile%3FAFFILIATE_SUBID%3DDT_%5Btracking-subid%5D&rank=7&bi=%7B%22blrs%22%3A88822%2C%22utm_source%22%3A%22Direct%22%7D&comp_iid=ed5e5dd0-97c9-4b74-951c-5df8acbdab77&uid=OhC1Ze8x10YjzV16864n&riid=Vjo0fDw2NZ8xBQ678cpm&tkn=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiY21zIiwidmVyc2lvbiI6MSwiaGFzaCI6Ik1UUlpwNmxzS2tYbXJSaFc4bnpTSjNvSDdEdz0iLCJpYXQiOjE3Njk5MzUzOTAsImV4cCI6MTc3MDAyMTc5MH0.FGA7uE6SPezT8-Tris0--tSzEl6ecXRRCgcbZopVfSk",
    "secondaryCtaText": "Get Protected",
    "reviewCount": 12775,
    "description": null
  },
  {
    "position": 8,
    "name": "Vivint",
    "slug": "vivint",
    "logoUrl": "./Top 10 Best Home Security System Providers_files/Product_Vivint2025_Size_300x100-Light-NoBg-20250612-104921.20250612113120.svg",
    "overallScore": 9.9,
    "scoreLabel": "Exceptional",
    "bottomLine": "Advanced equipment and custom-built security systems",
    "ribbon": null,
    "features": [
      "Get 5 months free with Code: 5FREE",
      "Free 4.6-star smart home app",
      "24/7 continuous video recording",
      "0% APR financing available",
      "Customizable options for every budget"
    ],
    "ctaUrl": "https://www.10rating/v?product_id=1246&url=https%3A%2F%2Ft.vivint.com%2F%3Fc%3D265%26lp%3D332%26s2%3D%5Btracking-subid%5D&rank=1&bi=%7B%22blrs%22%3A94491%2C%22utm_source%22%3A%22Direct%22%7D&comp_iid=8c297d78-bd32-45e2-bf20-0b3e6c394e56&uid=OhC1Ze8x10YjzV16864n&riid=Vjo0fDw2NZ8xBQ678cpm&tkn=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiY21zIiwidmVyc2lvbiI6MSwiaGFzaCI6InNLOTVoc2c4azRERmR5U0svZGgvSWNpTmY0Yz0iLCJpYXQiOjE3Njk5MzUzOTAsImV4cCI6MTc3MDAyMTc5MH0.XEdDm3fVym8dp7JIt-0tGoPDtCk_l16KJCQmQFpa9bI",
    "ctaText": "Visit Site",
    "secondaryCtaUrl": "https://www.10rating/v?product_id=1246&url=https%3A%2F%2Ft.vivint.com%2F%3Fc%3D265%26lp%3D332%26s2%3D%5Btracking-subid%5D&rank=1&bi=%7B%22blrs%22%3A94491%2C%22utm_source%22%3A%22Direct%22%7D&comp_iid=8c297d78-bd32-45e2-bf20-0b3e6c394e56&uid=OhC1Ze8x10YjzV16864n&riid=Vjo0fDw2NZ8xBQ678cpm&tkn=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiY21zIiwidmVyc2lvbiI6MSwiaGFzaCI6InNLOTVoc2c4azRERmR5U0svZGgvSWNpTmY0Yz0iLCJpYXQiOjE3Njk5MzUzOTAsImV4cCI6MTc3MDAyMTc5MH0.XEdDm3fVym8dp7JIt-0tGoPDtCk_l16KJCQmQFpa9bI",
    "secondaryCtaText": "Get Protected",
    "reviewCount": 57988,
    "description": null
  }
];

async function importData() {
  // 1. Get category to find product IDs
  const catRes = await fetch(`${API_BASE}/categories/${CATEGORY_SLUG}`);
  const category = await catRes.json();
  console.log('Category:', category.name, '- Products:', category.products.length);

  // 2. Match scraped products to existing products by name/slug
  for (const scraped of scrapedProducts) {
    const existing = category.products.find(p =>
      p.slug === scraped.slug ||
      p.name.toLowerCase() === scraped.name.toLowerCase()
    );

    if (!existing) {
      console.log(`⚠ No match for: ${scraped.name} (slug: ${scraped.slug})`);
      continue;
    }

    console.log(`Updating: ${existing.name} (id: ${existing.id})`);

    const res = await fetch(`${API_BASE}/products/${existing.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
      },
      body: JSON.stringify({
        overallScore: scraped.overallScore,
        scoreLabel: scraped.scoreLabel || null,
        bottomLine: scraped.bottomLine || null,
        ribbon: scraped.ribbon || null,
        ctaUrl: scraped.ctaUrl || null,
        ctaText: scraped.ctaText || 'Visit Site',
        features: scraped.features,
        rank: scraped.position,
      }),
    });

    if (res.ok) {
      console.log(`  ✓ Updated ${existing.name}`);
    } else {
      console.log(`  ✗ Failed ${existing.name}: ${res.status}`);
    }
  }

  console.log('\nDone! Refresh the comparison page to see changes.');
}

importData();