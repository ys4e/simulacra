const utils = require("utils.js");

/** Used to compare against the cache before checking. */
PACKET_NAME = "PlayerHandshakeCsReq";

const seedThreshold = parseInt(env.get("CLIENT_SEED_THRESHOLD"));
const expectedKeyId = parseInt(env.get("KEY_ID"));
const expectedTokenLength = parseInt(env.get("ACCOUNT_TOKEN_LENGTH"));
const expectedPlatformType = parseInt(env.get("PLATFORM_TYPE"));

let identified = undefined;

/**
 * @return void
 */
function init() {
    info("Loaded 'PlayerHandshakeCsReq' parser!");
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
        if (csc(id, fieldId, value)) continue;
        if (token(id, fieldId, value)) continue;

        // TODO: For this method to work, we need to ensure that it
        // TODO: only gets called on the 'PlayerHandshakeCsReq' packet.
        // if (encryptedSeed(id, fieldId, value)) continue;
    }

    for (const [fieldId, value] of data.allVarInt()) {
        if (keyId(id, fieldId, value)) continue;
        if (platformType(id, fieldId, value)) continue;
    }
}

/**
 * Checks if the message is literally 'csc'.
 *
 * @param id {number} The packet ID.
 * @param fieldId {number} The field ID.
 * @param value {string} The field string value.
 * @returns {boolean}
 */
const csc = (id, fieldId, value) => utils.exactCompare(
    "PlayerHandshakeCsReq", id, fieldId, value,
    "csc", "hash_type", "string"
);

/**
 * Checks if the message matches the key ID specified in the environment.
 * This is usually a single digit number.
 *
 * @param id {number} The packet ID.
 * @param fieldId {number} The field ID.
 * @param value {number} The field string value.
 * @returns {boolean}
 */
const keyId = (id, fieldId, value) => utils.exactCompare(
    "PlayerHandshakeCsReq", id, fieldId, value,
    expectedKeyId, "key_id", "uint32"
);

/**
 * Checks if the message matches the platform type specified in the environment.
 * If the value is -1, it will not compare.
 * If the value is 1, it will still not compare.
 *
 * @param id {number} The packet ID.
 * @param fieldId {number} The field ID.
 * @param value {number} The field string value.
 * @returns {boolean}
 */
function platformType(id, fieldId, value) {
    // -1 = unspecified; 1 = iOS, which is too common to use reliably.
    if (platformType === -1 || platformType === 1) return false;

    return utils.exactCompare(
        "PlayerHandshakeCsReq", id, fieldId, value,
        expectedPlatformType, "platform_type", "enum:PlatformType"
    );
}

/**
 * Checks if the message matches the token length specified in the environment.
 *
 * @param id {number} The packet ID.
 * @param fieldId {number} The field ID.
 * @param value {string} The field string value.
 */
function token(id, fieldId, value) {
    const length = value.length;

    // If the length is not what we expect, it is not a hash.
    if (length !== expectedTokenLength) return false;

    identify("PlayerHandshakeCsReq", id, {
        field_name: "token",
        field_id: fieldId,
        field_type: "string"
    });

    return true;
}

/**
 * Checks if the message is the longest in the list.
 *
 * @param id {number} The packet ID.
 * @param fieldId {number} The field ID.
 * @param value {string} The field string value.
 * @returns {boolean}
 */
function encryptedSeed(id, fieldId, value) {
    if (value.length < seedThreshold) return false;

    identify("PlayerHandshakeCsRsp", id, {
        field_name: "encrypted_seed",
        field_type: "string",
        field_id: fieldId
    });

    return true;
}
