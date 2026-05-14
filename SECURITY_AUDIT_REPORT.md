# 🔍 COMPREHENSIVE SECURITY & CODE QUALITY AUDIT

**Audit Date:** 2026-05-14T02:46:27.333Z
**Files Analyzed:** 4
**Total Issues Found:** 367

---

## 📊 SUMMARY

| Category | Critical | High | Medium | Low | Info | Total |
|----------|----------|------|--------|-----|------|-------|
| Security | 4 | 1 | 1 | 0 | 0 | 6 |
| Coding | 0 | 0 | 0 | 26 | 0 | 26 |
| DeadCode | 0 | 0 | 0 | 335 | 0 | 335 |
| Redundant | 0 | 0 | 0 | 0 | 0 | 0 |
| Performance | 0 | 0 | 0 | 0 | 0 | 0 |
| BestPractices | 0 | 0 | 0 | 0 | 0 | 0 |

---

## 🚨 CRITICAL SECURITY ISSUES


### Hardcoded JWT secret
- **File:** server.js:13
- **Severity:** CRITICAL
- **Recommendation:** Use environment variable: process.env.JWT_SECRET


### Hardcoded password hash in source code
- **File:** server.js:139
- **Severity:** CRITICAL
- **Recommendation:** Store password hash in environment variable or secure config file


### Hardcoded JWT secret
- **File:** server.js:151
- **Severity:** CRITICAL
- **Recommendation:** Use environment variable: process.env.JWT_SECRET


### Hardcoded JWT secret
- **File:** server.js:164
- **Severity:** CRITICAL
- **Recommendation:** Use environment variable: process.env.JWT_SECRET


---

## ⚠️ HIGH SEVERITY ISSUES


### API key exposed in code
- **File:** server.js:296
- **Severity:** HIGH
- **Recommendation:** Use environment variables for API keys


---

## 📝 MEDIUM SEVERITY ISSUES


### No input sanitization detected
- **File:** server.js:0
- **Recommendation:** Add input validation and sanitization


---

## 💡 LOW SEVERITY & BEST PRACTICES

- [server.js:263] Console logging in production code - Remove or use a logging library with levels
- [server.js:304] Console logging in production code - Remove or use a logging library with levels
- [server.js:305] Console logging in production code - Remove or use a logging library with levels
- [script.js:15] Console logging in production code - Remove or use a logging library with levels
- [script.js:19] Console logging in production code - Remove or use a logging library with levels
- [script.js:74] Console logging in production code - Remove or use a logging library with levels
- [script.js:84] Console logging in production code - Remove or use a logging library with levels
- [script.js:239] Console logging in production code - Remove or use a logging library with levels
- [script.js:380] Console logging in production code - Remove or use a logging library with levels
- [script.js:553] Console logging in production code - Remove or use a logging library with levels
- [script.js:848] Console logging in production code - Remove or use a logging library with levels
- [script.js:852] Console logging in production code - Remove or use a logging library with levels
- [script.js:885] Console logging in production code - Remove or use a logging library with levels
- [script.js:915] Console logging in production code - Remove or use a logging library with levels
- [script.js:955] Console logging in production code - Remove or use a logging library with levels
- [script.js:964] Console logging in production code - Remove or use a logging library with levels
- [script.js:1384] Console logging in production code - Remove or use a logging library with levels
- [script.js:1402] Console logging in production code - Remove or use a logging library with levels
- [script.js:1746] Console logging in production code - Remove or use a logging library with levels
- [script.js:2001] Console logging in production code - Remove or use a logging library with levels
- [script.js:2002] Console logging in production code - Remove or use a logging library with levels
- [script.js:2003] Console logging in production code - Remove or use a logging library with levels
- [script.js:2004] Console logging in production code - Remove or use a logging library with levels
- [script.js:2005] Console logging in production code - Remove or use a logging library with levels
- [script.js:2006] Console logging in production code - Remove or use a logging library with levels
- [script.js:2007] Console logging in production code - Remove or use a logging library with levels

---

## 🗑️ DEAD CODE

- [server.js:1] Commented out code
- [server.js:2] Commented out code
- [server.js:3] Commented out code
- [server.js:4] Commented out code
- [server.js:5] Commented out code
- [server.js:6] Commented out code
- [server.js:7] Commented out code
- [server.js:8] Commented out code
- [server.js:9] Commented out code
- [server.js:11] Commented out code
- [server.js:12] Commented out code
- [server.js:13] Commented out code
- [server.js:22] Commented out code
- [server.js:23] Commented out code
- [server.js:24] Commented out code
- [server.js:119] Commented out code
- [server.js:122] Commented out code
- [server.js:124] Commented out code
- [server.js:131] Commented out code
- [server.js:136] Commented out code
- [server.js:139] Commented out code
- [server.js:143] Commented out code
- [server.js:144] Commented out code
- [server.js:151] Commented out code
- [server.js:161] Commented out code
- [server.js:164] Commented out code
- [server.js:186] Commented out code
- [server.js:187] Commented out code
- [server.js:204] Commented out code
- [server.js:205] Commented out code
- [server.js:206] Commented out code
- [server.js:214] Commented out code
- [server.js:218] Commented out code
- [server.js:219] Commented out code
- [server.js:221] Commented out code
- [server.js:223] Commented out code
- [server.js:224] Commented out code
- [server.js:240] Commented out code
- [server.js:241] Commented out code
- [server.js:242] Commented out code
- [server.js:280] Commented out code
- [server.js:287] Commented out code
- [server.js:292] Commented out code
- [server.js:293] Commented out code
- [server.js:296] Commented out code
- [script.js:8] Commented out code
- [script.js:12] Commented out code
- [script.js:66] Commented out code
- [script.js:67] Commented out code
- [script.js:68] Commented out code
- [script.js:89] Commented out code
- [script.js:99] Commented out code
- [script.js:104] Commented out code
- [script.js:107] Commented out code
- [script.js:134] Commented out code
- [script.js:138] Commented out code
- [script.js:152] Commented out code
- [script.js:166] Commented out code
- [script.js:167] Commented out code
- [script.js:180] Commented out code
- [script.js:184] Commented out code
- [script.js:189] Commented out code
- [script.js:201] Commented out code
- [script.js:208] Commented out code
- [script.js:222] Commented out code
- [script.js:225] Commented out code
- [script.js:227] Commented out code
- [script.js:238] Commented out code
- [script.js:247] Commented out code
- [script.js:248] Commented out code
- [script.js:249] Commented out code
- [script.js:250] Commented out code
- [script.js:251] Commented out code
- [script.js:254] Commented out code
- [script.js:257] Commented out code
- [script.js:258] Commented out code
- [script.js:259] Commented out code
- [script.js:260] Commented out code
- [script.js:266] Commented out code
- [script.js:268] Commented out code
- [script.js:269] Commented out code
- [script.js:270] Commented out code
- [script.js:280] Commented out code
- [script.js:281] Commented out code
- [script.js:282] Commented out code
- [script.js:291] Commented out code
- [script.js:292] Commented out code
- [script.js:323] Commented out code
- [script.js:324] Commented out code
- [script.js:343] Commented out code
- [script.js:344] Commented out code
- [script.js:347] Commented out code
- [script.js:351] Commented out code
- [script.js:356] Commented out code
- [script.js:357] Commented out code
- [script.js:389] Commented out code
- [script.js:398] Commented out code
- [script.js:399] Commented out code
- [script.js:402] Commented out code
- [script.js:407] Commented out code
- [script.js:417] Commented out code
- [script.js:418] Commented out code
- [script.js:419] Commented out code
- [script.js:420] Commented out code
- [script.js:421] Commented out code
- [script.js:432] Commented out code
- [script.js:433] Commented out code
- [script.js:434] Commented out code
- [script.js:435] Commented out code
- [script.js:448] Commented out code
- [script.js:449] Commented out code
- [script.js:457] Commented out code
- [script.js:458] Commented out code
- [script.js:459] Commented out code
- [script.js:461] Commented out code
- [script.js:462] Commented out code
- [script.js:463] Commented out code
- [script.js:467] Commented out code
- [script.js:474] Commented out code
- [script.js:475] Commented out code
- [script.js:476] Commented out code
- [script.js:480] Commented out code
- [script.js:496] Commented out code
- [script.js:499] Commented out code
- [script.js:506] Commented out code
- [script.js:509] Commented out code
- [script.js:525] Commented out code
- [script.js:526] Commented out code
- [script.js:527] Commented out code
- [script.js:556] Commented out code
- [script.js:557] Commented out code
- [script.js:560] Commented out code
- [script.js:565] Commented out code
- [script.js:566] Commented out code
- [script.js:567] Commented out code
- [script.js:569] Commented out code
- [script.js:570] Commented out code
- [script.js:572] Commented out code
- [script.js:573] Commented out code
- [script.js:580] Commented out code
- [script.js:581] Commented out code
- [script.js:582] Commented out code
- [script.js:584] Commented out code
- [script.js:585] Commented out code
- [script.js:587] Commented out code
- [script.js:588] Commented out code
- [script.js:604] Commented out code
- [script.js:608] Commented out code
- [script.js:609] Commented out code
- [script.js:610] Commented out code
- [script.js:612] Commented out code
- [script.js:613] Commented out code
- [script.js:615] Commented out code
- [script.js:616] Commented out code
- [script.js:627] Commented out code
- [script.js:631] Commented out code
- [script.js:632] Commented out code
- [script.js:633] Commented out code
- [script.js:635] Commented out code
- [script.js:636] Commented out code
- [script.js:638] Commented out code
- [script.js:639] Commented out code
- [script.js:650] Commented out code
- [script.js:654] Commented out code
- [script.js:655] Commented out code
- [script.js:656] Commented out code
- [script.js:658] Commented out code
- [script.js:659] Commented out code
- [script.js:661] Commented out code
- [script.js:662] Commented out code
- [script.js:673] Commented out code
- [script.js:674] Commented out code
- [script.js:678] Commented out code
- [script.js:679] Commented out code
- [script.js:680] Commented out code
- [script.js:683] Commented out code
- [script.js:684] Commented out code
- [script.js:686] Commented out code
- [script.js:687] Commented out code
- [script.js:703] Commented out code
- [script.js:704] Commented out code
- [script.js:705] Commented out code
- [script.js:706] Commented out code
- [script.js:707] Commented out code
- [script.js:734] Commented out code
- [script.js:735] Commented out code
- [script.js:736] Commented out code
- [script.js:737] Commented out code
- [script.js:748] Commented out code
- [script.js:749] Commented out code
- [script.js:751] Commented out code
- [script.js:752] Commented out code
- [script.js:775] Commented out code
- [script.js:804] Commented out code
- [script.js:805] Commented out code
- [script.js:809] Commented out code
- [script.js:813] Commented out code
- [script.js:814] Commented out code
- [script.js:815] Commented out code
- [script.js:817] Commented out code
- [script.js:818] Commented out code
- [script.js:821] Commented out code
- [script.js:822] Commented out code
- [script.js:846] Commented out code
- [script.js:854] Commented out code
- [script.js:855] Commented out code
- [script.js:856] Commented out code
- [script.js:857] Commented out code
- [script.js:858] Commented out code
- [script.js:897] Commented out code
- [script.js:898] Commented out code
- [script.js:922] Commented out code
- [script.js:923] Commented out code
- [script.js:927] Commented out code
- [script.js:928] Commented out code
- [script.js:945] Commented out code
- [script.js:946] Commented out code
- [script.js:973] Commented out code
- [script.js:974] Commented out code
- [script.js:978] Commented out code
- [script.js:979] Commented out code
- [script.js:988] Commented out code
- [script.js:989] Commented out code
- [script.js:1003] Commented out code
- [script.js:1005] Commented out code
- [script.js:1019] Commented out code
- [script.js:1020] Commented out code
- [script.js:1025] Commented out code
- [script.js:1040] Commented out code
- [script.js:1134] Commented out code
- [script.js:1135] Commented out code
- [script.js:1136] Commented out code
- [script.js:1137] Commented out code
- [script.js:1138] Commented out code
- [script.js:1139] Commented out code
- [script.js:1140] Commented out code
- [script.js:1141] Commented out code
- [script.js:1148] Commented out code
- [script.js:1149] Commented out code
- [script.js:1154] Commented out code
- [script.js:1156] Commented out code
- [script.js:1157] Commented out code
- [script.js:1173] Commented out code
- [script.js:1180] Commented out code
- [script.js:1181] Commented out code
- [script.js:1213] Commented out code
- [script.js:1226] Commented out code
- [script.js:1257] Commented out code
- [script.js:1259] Commented out code
- [script.js:1260] Commented out code
- [script.js:1273] Commented out code
- [script.js:1274] Commented out code
- [script.js:1277] Commented out code
- [script.js:1367] Commented out code
- [script.js:1373] Commented out code
- [script.js:1374] Commented out code
- [script.js:1375] Commented out code
- [script.js:1378] Commented out code
- [script.js:1381] Commented out code
- [script.js:1414] Commented out code
- [script.js:1417] Commented out code
- [script.js:1420] Commented out code
- [script.js:1427] Commented out code
- [script.js:1428] Commented out code
- [script.js:1431] Commented out code
- [script.js:1432] Commented out code
- [script.js:1435] Commented out code
- [script.js:1436] Commented out code
- [script.js:1439] Commented out code
- [script.js:1440] Commented out code
- [script.js:1443] Commented out code
- [script.js:1444] Commented out code
- [script.js:1467] Commented out code
- [script.js:1471] Commented out code
- [script.js:1472] Commented out code
- [script.js:1475] Commented out code
- [script.js:1494] Commented out code
- [script.js:1506] Commented out code
- [script.js:1517] Commented out code
- [script.js:1538] Commented out code
- [script.js:1577] Commented out code
- [script.js:1601] Commented out code
- [script.js:1607] Commented out code
- [script.js:1610] Commented out code
- [script.js:1627] Commented out code
- [script.js:1628] Commented out code
- [script.js:1629] Commented out code
- [script.js:1636] Commented out code
- [script.js:1649] Commented out code
- [script.js:1657] Commented out code
- [script.js:1661] Commented out code
- [script.js:1668] Commented out code
- [script.js:1671] Commented out code
- [script.js:1677] Commented out code
- [script.js:1683] Commented out code
- [script.js:1689] Commented out code
- [script.js:1695] Commented out code
- [script.js:1729] Commented out code
- [script.js:1736] Commented out code
- [script.js:1737] Commented out code
- [script.js:1740] Commented out code
- [script.js:1749] Commented out code
- [script.js:1750] Commented out code
- [script.js:1774] Commented out code
- [script.js:1775] Commented out code
- [script.js:1799] Commented out code
- [script.js:1800] Commented out code
- [script.js:1802] Commented out code
- [script.js:1804] Commented out code
- [script.js:1841] Commented out code
- [script.js:1845] Commented out code
- [script.js:1849] Commented out code
- [script.js:1874] Commented out code
- [script.js:1878] Commented out code
- [script.js:1879] Commented out code
- [script.js:1880] Commented out code
- [script.js:1883] Commented out code
- [script.js:1884] Commented out code
- [script.js:1903] Commented out code
- [script.js:1904] Commented out code
- [script.js:1908] Commented out code
- [script.js:1909] Commented out code
- [script.js:1916] Commented out code
- [script.js:1917] Commented out code
- [script.js:1918] Commented out code
- [script.js:1934] Commented out code
- [script.js:1935] Commented out code
- [script.js:1940] Commented out code
- [script.js:1944] Commented out code
- [script.js:1945] Commented out code
- [script.js:1946] Commented out code
- [script.js:1948] Commented out code
- [script.js:1949] Commented out code
- [script.js:1952] Commented out code
- [script.js:1953] Commented out code

---

## ⚡ PERFORMANCE ISSUES

No performance issues found.

---

## 🔧 RECOMMENDED ACTIONS

### Immediate (Critical/High):
1. Remove hardcoded secrets and use environment variables
2. Move password hash to environment variable
3. Add input validation and sanitization
4. Fix API key exposure

### Short-term (Medium):
1. Add error handling for file operations
2. Remove console.log statements
3. Replace var with let/const

### Long-term (Low/Best Practices):
1. Remove dead code
2. Address TODO comments
3. Extract magic numbers to constants
4. Add comprehensive input validation

---

## 📋 DETAILED FINDINGS

### Security Issues: 6
- [CRITICAL] server.js:13 - Hardcoded JWT secret
- [CRITICAL] server.js:139 - Hardcoded password hash in source code
- [CRITICAL] server.js:151 - Hardcoded JWT secret
- [CRITICAL] server.js:164 - Hardcoded JWT secret
- [HIGH] server.js:296 - API key exposed in code
- [MEDIUM] server.js:0 - No input sanitization detected

### Coding Issues: 26
- [LOW] server.js:263 - Console logging in production code
- [LOW] server.js:304 - Console logging in production code
- [LOW] server.js:305 - Console logging in production code
- [LOW] script.js:15 - Console logging in production code
- [LOW] script.js:19 - Console logging in production code
- [LOW] script.js:74 - Console logging in production code
- [LOW] script.js:84 - Console logging in production code
- [LOW] script.js:239 - Console logging in production code
- [LOW] script.js:380 - Console logging in production code
- [LOW] script.js:553 - Console logging in production code
- [LOW] script.js:848 - Console logging in production code
- [LOW] script.js:852 - Console logging in production code
- [LOW] script.js:885 - Console logging in production code
- [LOW] script.js:915 - Console logging in production code
- [LOW] script.js:955 - Console logging in production code
- [LOW] script.js:964 - Console logging in production code
- [LOW] script.js:1384 - Console logging in production code
- [LOW] script.js:1402 - Console logging in production code
- [LOW] script.js:1746 - Console logging in production code
- [LOW] script.js:2001 - Console logging in production code
- [LOW] script.js:2002 - Console logging in production code
- [LOW] script.js:2003 - Console logging in production code
- [LOW] script.js:2004 - Console logging in production code
- [LOW] script.js:2005 - Console logging in production code
- [LOW] script.js:2006 - Console logging in production code
- [LOW] script.js:2007 - Console logging in production code

### Dead Code: 335
- server.js:1 - Commented out code
- server.js:2 - Commented out code
- server.js:3 - Commented out code
- server.js:4 - Commented out code
- server.js:5 - Commented out code
- server.js:6 - Commented out code
- server.js:7 - Commented out code
- server.js:8 - Commented out code
- server.js:9 - Commented out code
- server.js:11 - Commented out code
- server.js:12 - Commented out code
- server.js:13 - Commented out code
- server.js:22 - Commented out code
- server.js:23 - Commented out code
- server.js:24 - Commented out code
- server.js:119 - Commented out code
- server.js:122 - Commented out code
- server.js:124 - Commented out code
- server.js:131 - Commented out code
- server.js:136 - Commented out code
- server.js:139 - Commented out code
- server.js:143 - Commented out code
- server.js:144 - Commented out code
- server.js:151 - Commented out code
- server.js:161 - Commented out code
- server.js:164 - Commented out code
- server.js:186 - Commented out code
- server.js:187 - Commented out code
- server.js:204 - Commented out code
- server.js:205 - Commented out code
- server.js:206 - Commented out code
- server.js:214 - Commented out code
- server.js:218 - Commented out code
- server.js:219 - Commented out code
- server.js:221 - Commented out code
- server.js:223 - Commented out code
- server.js:224 - Commented out code
- server.js:240 - Commented out code
- server.js:241 - Commented out code
- server.js:242 - Commented out code
- server.js:280 - Commented out code
- server.js:287 - Commented out code
- server.js:292 - Commented out code
- server.js:293 - Commented out code
- server.js:296 - Commented out code
- script.js:8 - Commented out code
- script.js:12 - Commented out code
- script.js:66 - Commented out code
- script.js:67 - Commented out code
- script.js:68 - Commented out code
- script.js:89 - Commented out code
- script.js:99 - Commented out code
- script.js:104 - Commented out code
- script.js:107 - Commented out code
- script.js:134 - Commented out code
- script.js:138 - Commented out code
- script.js:152 - Commented out code
- script.js:166 - Commented out code
- script.js:167 - Commented out code
- script.js:180 - Commented out code
- script.js:184 - Commented out code
- script.js:189 - Commented out code
- script.js:201 - Commented out code
- script.js:208 - Commented out code
- script.js:222 - Commented out code
- script.js:225 - Commented out code
- script.js:227 - Commented out code
- script.js:238 - Commented out code
- script.js:247 - Commented out code
- script.js:248 - Commented out code
- script.js:249 - Commented out code
- script.js:250 - Commented out code
- script.js:251 - Commented out code
- script.js:254 - Commented out code
- script.js:257 - Commented out code
- script.js:258 - Commented out code
- script.js:259 - Commented out code
- script.js:260 - Commented out code
- script.js:266 - Commented out code
- script.js:268 - Commented out code
- script.js:269 - Commented out code
- script.js:270 - Commented out code
- script.js:280 - Commented out code
- script.js:281 - Commented out code
- script.js:282 - Commented out code
- script.js:291 - Commented out code
- script.js:292 - Commented out code
- script.js:323 - Commented out code
- script.js:324 - Commented out code
- script.js:343 - Commented out code
- script.js:344 - Commented out code
- script.js:347 - Commented out code
- script.js:351 - Commented out code
- script.js:356 - Commented out code
- script.js:357 - Commented out code
- script.js:389 - Commented out code
- script.js:398 - Commented out code
- script.js:399 - Commented out code
- script.js:402 - Commented out code
- script.js:407 - Commented out code
- script.js:417 - Commented out code
- script.js:418 - Commented out code
- script.js:419 - Commented out code
- script.js:420 - Commented out code
- script.js:421 - Commented out code
- script.js:432 - Commented out code
- script.js:433 - Commented out code
- script.js:434 - Commented out code
- script.js:435 - Commented out code
- script.js:448 - Commented out code
- script.js:449 - Commented out code
- script.js:457 - Commented out code
- script.js:458 - Commented out code
- script.js:459 - Commented out code
- script.js:461 - Commented out code
- script.js:462 - Commented out code
- script.js:463 - Commented out code
- script.js:467 - Commented out code
- script.js:474 - Commented out code
- script.js:475 - Commented out code
- script.js:476 - Commented out code
- script.js:480 - Commented out code
- script.js:496 - Commented out code
- script.js:499 - Commented out code
- script.js:506 - Commented out code
- script.js:509 - Commented out code
- script.js:525 - Commented out code
- script.js:526 - Commented out code
- script.js:527 - Commented out code
- script.js:556 - Commented out code
- script.js:557 - Commented out code
- script.js:560 - Commented out code
- script.js:565 - Commented out code
- script.js:566 - Commented out code
- script.js:567 - Commented out code
- script.js:569 - Commented out code
- script.js:570 - Commented out code
- script.js:572 - Commented out code
- script.js:573 - Commented out code
- script.js:580 - Commented out code
- script.js:581 - Commented out code
- script.js:582 - Commented out code
- script.js:584 - Commented out code
- script.js:585 - Commented out code
- script.js:587 - Commented out code
- script.js:588 - Commented out code
- script.js:604 - Commented out code
- script.js:608 - Commented out code
- script.js:609 - Commented out code
- script.js:610 - Commented out code
- script.js:612 - Commented out code
- script.js:613 - Commented out code
- script.js:615 - Commented out code
- script.js:616 - Commented out code
- script.js:627 - Commented out code
- script.js:631 - Commented out code
- script.js:632 - Commented out code
- script.js:633 - Commented out code
- script.js:635 - Commented out code
- script.js:636 - Commented out code
- script.js:638 - Commented out code
- script.js:639 - Commented out code
- script.js:650 - Commented out code
- script.js:654 - Commented out code
- script.js:655 - Commented out code
- script.js:656 - Commented out code
- script.js:658 - Commented out code
- script.js:659 - Commented out code
- script.js:661 - Commented out code
- script.js:662 - Commented out code
- script.js:673 - Commented out code
- script.js:674 - Commented out code
- script.js:678 - Commented out code
- script.js:679 - Commented out code
- script.js:680 - Commented out code
- script.js:683 - Commented out code
- script.js:684 - Commented out code
- script.js:686 - Commented out code
- script.js:687 - Commented out code
- script.js:703 - Commented out code
- script.js:704 - Commented out code
- script.js:705 - Commented out code
- script.js:706 - Commented out code
- script.js:707 - Commented out code
- script.js:734 - Commented out code
- script.js:735 - Commented out code
- script.js:736 - Commented out code
- script.js:737 - Commented out code
- script.js:748 - Commented out code
- script.js:749 - Commented out code
- script.js:751 - Commented out code
- script.js:752 - Commented out code
- script.js:775 - Commented out code
- script.js:804 - Commented out code
- script.js:805 - Commented out code
- script.js:809 - Commented out code
- script.js:813 - Commented out code
- script.js:814 - Commented out code
- script.js:815 - Commented out code
- script.js:817 - Commented out code
- script.js:818 - Commented out code
- script.js:821 - Commented out code
- script.js:822 - Commented out code
- script.js:846 - Commented out code
- script.js:854 - Commented out code
- script.js:855 - Commented out code
- script.js:856 - Commented out code
- script.js:857 - Commented out code
- script.js:858 - Commented out code
- script.js:897 - Commented out code
- script.js:898 - Commented out code
- script.js:922 - Commented out code
- script.js:923 - Commented out code
- script.js:927 - Commented out code
- script.js:928 - Commented out code
- script.js:945 - Commented out code
- script.js:946 - Commented out code
- script.js:973 - Commented out code
- script.js:974 - Commented out code
- script.js:978 - Commented out code
- script.js:979 - Commented out code
- script.js:988 - Commented out code
- script.js:989 - Commented out code
- script.js:1003 - Commented out code
- script.js:1005 - Commented out code
- script.js:1019 - Commented out code
- script.js:1020 - Commented out code
- script.js:1025 - Commented out code
- script.js:1040 - Commented out code
- script.js:1134 - Commented out code
- script.js:1135 - Commented out code
- script.js:1136 - Commented out code
- script.js:1137 - Commented out code
- script.js:1138 - Commented out code
- script.js:1139 - Commented out code
- script.js:1140 - Commented out code
- script.js:1141 - Commented out code
- script.js:1148 - Commented out code
- script.js:1149 - Commented out code
- script.js:1154 - Commented out code
- script.js:1156 - Commented out code
- script.js:1157 - Commented out code
- script.js:1173 - Commented out code
- script.js:1180 - Commented out code
- script.js:1181 - Commented out code
- script.js:1213 - Commented out code
- script.js:1226 - Commented out code
- script.js:1257 - Commented out code
- script.js:1259 - Commented out code
- script.js:1260 - Commented out code
- script.js:1273 - Commented out code
- script.js:1274 - Commented out code
- script.js:1277 - Commented out code
- script.js:1367 - Commented out code
- script.js:1373 - Commented out code
- script.js:1374 - Commented out code
- script.js:1375 - Commented out code
- script.js:1378 - Commented out code
- script.js:1381 - Commented out code
- script.js:1414 - Commented out code
- script.js:1417 - Commented out code
- script.js:1420 - Commented out code
- script.js:1427 - Commented out code
- script.js:1428 - Commented out code
- script.js:1431 - Commented out code
- script.js:1432 - Commented out code
- script.js:1435 - Commented out code
- script.js:1436 - Commented out code
- script.js:1439 - Commented out code
- script.js:1440 - Commented out code
- script.js:1443 - Commented out code
- script.js:1444 - Commented out code
- script.js:1467 - Commented out code
- script.js:1471 - Commented out code
- script.js:1472 - Commented out code
- script.js:1475 - Commented out code
- script.js:1494 - Commented out code
- script.js:1506 - Commented out code
- script.js:1517 - Commented out code
- script.js:1538 - Commented out code
- script.js:1577 - Commented out code
- script.js:1601 - Commented out code
- script.js:1607 - Commented out code
- script.js:1610 - Commented out code
- script.js:1627 - Commented out code
- script.js:1628 - Commented out code
- script.js:1629 - Commented out code
- script.js:1636 - Commented out code
- script.js:1649 - Commented out code
- script.js:1657 - Commented out code
- script.js:1661 - Commented out code
- script.js:1668 - Commented out code
- script.js:1671 - Commented out code
- script.js:1677 - Commented out code
- script.js:1683 - Commented out code
- script.js:1689 - Commented out code
- script.js:1695 - Commented out code
- script.js:1729 - Commented out code
- script.js:1736 - Commented out code
- script.js:1737 - Commented out code
- script.js:1740 - Commented out code
- script.js:1749 - Commented out code
- script.js:1750 - Commented out code
- script.js:1774 - Commented out code
- script.js:1775 - Commented out code
- script.js:1799 - Commented out code
- script.js:1800 - Commented out code
- script.js:1802 - Commented out code
- script.js:1804 - Commented out code
- script.js:1841 - Commented out code
- script.js:1845 - Commented out code
- script.js:1849 - Commented out code
- script.js:1874 - Commented out code
- script.js:1878 - Commented out code
- script.js:1879 - Commented out code
- script.js:1880 - Commented out code
- script.js:1883 - Commented out code
- script.js:1884 - Commented out code
- script.js:1903 - Commented out code
- script.js:1904 - Commented out code
- script.js:1908 - Commented out code
- script.js:1909 - Commented out code
- script.js:1916 - Commented out code
- script.js:1917 - Commented out code
- script.js:1918 - Commented out code
- script.js:1934 - Commented out code
- script.js:1935 - Commented out code
- script.js:1940 - Commented out code
- script.js:1944 - Commented out code
- script.js:1945 - Commented out code
- script.js:1946 - Commented out code
- script.js:1948 - Commented out code
- script.js:1949 - Commented out code
- script.js:1952 - Commented out code
- script.js:1953 - Commented out code

### Redundant Code: 0


### Performance: 0


### Best Practices: 0


---

**Audit Completed:** 2026-05-14T02:46:27.334Z
**Auditor:** Hermes Code Quality Analyzer
