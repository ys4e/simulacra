/**
 * Exactly compares two provided values.
 *
 * @param packetName {string} The name of the packet.
 * @param packetId {number} The ID of the packet.
 * @param fieldId {number} The ID of the field.
 * @param fieldValue {string | number} The value of the field.
 * @param compareValue {string | number} The value to compare to.
 * @param fieldName {string} The name of the field.
 * @param fieldType {string} The type of the field.
 * @return {boolean}
 */
function exactCompare(
    packetName, packetId,
    fieldId, fieldValue,
    compareValue,
    fieldName, fieldType
) {
    if (fieldValue !== compareValue) {
        return false;
    }

    identify(packetName, packetId, {
        field_name: fieldName,
        field_id: fieldId,
        field_type: fieldType
    });

    return true;
}

module.exports = { exactCompare };