function parseParentId(parentId) {
  if (!parentId || parentId === "NULL") return null;
  return parentId;
}

function validateEvent(row) {
  const [
    eventId,
    eventName,
    startDate,
    endDate,
    parentId,
    researchValue,
    description,
  ] = row;
  if (
    !eventId ||
    !eventName ||
    !startDate ||
    !endDate ||
    !researchValue ||
    !description
  )
    return false;
  if (isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) return false;
  if (isNaN(parseInt(researchValue))) return false;
  if (parseInt(researchValue) < 0) return false;
  if (eventId.length < 10) return false;
  return true;
}

module.exports = { validateEvent, parseParentId };
