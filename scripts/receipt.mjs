// Reads the outcome of a decided transaction without depending on one exact receipt shape.
// genlayer-js versions name the fields differently (txExecutionResultName, resultName, consensus_data.leader_receipt[].execution_result ...),
// and a receipt without a readable result must never count as a success, so the whole receipt is searched.
const replacer = (_k, v) => (typeof v === "bigint" ? v.toString() : v);

export function outcome(receipt) {
  let text = "";
  try {
    text = JSON.stringify(receipt ?? null, replacer) ?? "";
  } catch {
    text = String(receipt);
  }
  const failed = /FINISHED_WITH_ERROR|"execution_result"\s*:\s*"ERROR"|"(?:txExecutionResultName|resultName)"\s*:\s*"[^"]*ERROR/.test(text);
  const succeeded = /FINISHED_WITH_RETURN|"execution_result"\s*:\s*"(?:SUCCESS|RETURN)"|"(?:txExecutionResultName|resultName)"\s*:\s*"[^"]*RETURN/.test(text);
  const named = receipt?.statusName ?? receipt?.status_name ?? receipt?.status ?? "";
  if (failed) return { ok: false, known: true, status: `${named || "decided"} / error` };
  if (succeeded) return { ok: true, known: true, status: `${named || "decided"} / success` };
  return { ok: false, known: false, status: `unreadable receipt (${Object.keys(receipt ?? {}).slice(0, 12).join(", ") || "empty"})`, raw: text.slice(0, 700) };
}
