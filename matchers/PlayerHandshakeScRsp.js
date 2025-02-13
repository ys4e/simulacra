/** This private key will need to be changed if you are playing in a different region. */
const PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAsJbFp3WcsiojjdQtVnTuvtawL2m4XxK93F6lCnFwcZqUP39t
xFGGlrogHMqreyawIUN7E5shtwGzigzjW8Ly5CryBJpXP3ehNTqJS7emb+9LlC19
Oxa1eQuUQnatgcsd16DPH7kJ5JzN3vXnhvUyk4Qficdmm0uk7FRaNYFi7EJs4xyq
FTrp3rDZ0dzBHumlIeK1om7FNt6Nyivgp+UybO7kl0NLFEeSlV4S+7ofitWQsO5x
YqKAzSzz+KIRQcxJidGBlZ1JN/g5DPDpx/ztvOWYUlM7TYk6xN3focZpU0kBzAw/
rn94yW9z8jpXfzk+MvWzVL/HAcPy4ySwkay0NwIDAQABAoIBADzKWpawbVYEHaM4
lLb7oCjAPXzE9zx7djLDvisfLCdfoINPedkoe52ty1o+BtRpWB7LXTY9pFic1FLE
5wvyy6zyf8hH3ZsysqNhWFxhh4FnLmx/UGokAir+anaK5mYVJ1vQtxzjlV1HAbQs
kRyrklKoHDdRFqiFXOwiib97oDNWhD+RxfyGwwJnynZZSXdLbLSiz/QHQNr/+Ufk
KRBaxt0CfU7mOLZxoy6fNAxHdBcBJPHCyh+aDvEbix7nSncSU8Ju/48YJ8DrglbZ
sXCYoA5Uz8NMDuaEMgoNWCFQVoEcRkEUoaH7BlWd3UUFRPnDZ1B4BmkrVoRE8a58
3OqSwakCgYEA19wQUISXtpnmCrEZfbyZ6IwOy8ZCVaVUtbTjVa8UyfNglzzJG3yz
cXU3X35v5/HNCHaXbG2qcbQLThnHBA+obW3RDo+Q49V84Zh1fUNH0ONHHuC09kB/
/gHqzn/4nLf1aJ2O0NrMyrZNsZ0ZKUKQuVCqWjBOmTNUitcc8RpXZ8sCgYEA0W09
POM/It7RoVGI+cfbbgSRmzFo9kzSp5lP7iZ81bnvUMabu2nv3OeGc3Pmdh1ZJFRw
6iDM6VVbG0uz8g+f8+JT32XdqM7MJAmgfcYfTVBMiVnh330WNkeRrGWqQzB2f2Wr
+0vJjU8CAAcOWDh0oNguJ1l1TSyKxqdL8FsA38UCgYEAudt1AJ7psgOYmqQZ+rUl
H6FYLAQsoWmVIk75XpE9KRUwmYdw8QXRy2LNpp9K4z7C9wKFJorWMsh+42Q2gzyo
HHBtjEf4zPLIb8XBg3UmpKjMV73Kkiy/B4nHDr4I5YdO+iCPEy0RH4kQJFnLjEcQ
LT9TLgxh4G7d4B2PgdjYYTkCgYEArdgiV2LETCvulBzcuYufqOn9/He9i4cl7p4j
bathQQFBmSnkqGQ+Cn/eagQxsKaYEsJNoOxtbNu/7x6eVzeFLawYt38Vy0UuzFN5
eC54WXNotTN5fk2VnKU4VYVnGrMmCobZhpbYzoZhQKiazby/g60wUtW9u7xXzqOd
M/428YkCgYBwbEOx1RboH8H+fP1CAiF+cqtq4Jrz9IRWPOgcDpt2Usk1rDweWrZx
bTRlwIaVc5csIEE2X02fut/TTXr1MoXHa6s2cQrnZYq44488NsO4TAC26hqs/x/H
bVOcX13gT26SYngAHHeh7xjWJr/KgIIwvcvgvoVs6lu7a8aLUvrOag==
-----END RSA PRIVATE KEY-----`;

/** Used to compare against the cache before checking. */
PACKET_NAME = "PlayerHandshakeScRsp";

/**
 * @return void
 */
function init() {
    info("Loaded 'PlayerHandshakeScRsp' parser!");
}

/**
 * @param id {number}
 * @param header {SerializedMessage}
 * @param data {SerializedMessage}
 * @return void
 */
function compare(id, header, data) {
    // Enumerate over all keys.
    for (const [fieldId, value] of data.allString()) {
        if (encryptedSeed(id, fieldId, value)) continue;
        if (ipAddress(id, fieldId, value)) continue;
    }

    for (const [fieldId, value] of data.allVarInt()) {
        if (userId(id, fieldId, value)) continue;
    }
}

/**
 * Checks if the message is an RSA encrypted, Base64-encoded sequence of bytes.
 *
 * @param id {number} The packet ID.
 * @param fieldId {number} The field ID.
 * @param value {string} The field string value.
 * @return {boolean}
 */
function encryptedSeed(id, fieldId, value) {
    try {
        // If this fails, it isn't the right field.
        rsaDecrypt(PRIVATE_KEY, value);

        identify("PlayerHandshakeScRsp", id, {
            field_name: "encrypted_seed",
            field_type: "string",
            field_id: fieldId
        });

        return true;
    } catch {
        return false;
    }
}

/**
 * Checks if a message matches the IP address specified in the environment.
 *
 * @param id The packet ID.
 * @param fieldId The field ID.
 * @param value The field string value.
 * @return {boolean}
 */
function ipAddress(id, fieldId, value) {
    const ip = env.get("IP_ADDRESS");
    if (value !== ip) return false;

    identify("PlayerHandshakeScRsp", id, {
        field_name: "ip_address",
        field_id: fieldId,
        field_type: "string"
    });
}

/**
 * Checks if a message matches the UID specified in the environment.
 *
 * @param id The packet ID.
 * @param fieldId The field ID.
 * @param value The field string value.
 * @returns {boolean}
 */
function userId(id, fieldId, value) {
    const uid = parseInt(env.get("GAME_UID"));
    if (value !== uid) return false;

    identify("PlayerHandshakeScRsp", id, {
        field_name: "uid",
        field_id: fieldId,
        field_type: "string"
    });
}

