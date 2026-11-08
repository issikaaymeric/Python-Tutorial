/* Python execution worker powered by Pyodide.
   Code runs in a dedicated worker so normal page interactions remain responsive. */
importScripts("https://cdn.jsdelivr.net/pyodide/v0.29.5/full/pyodide.js");

let runtimePromise;

async function getRuntime() {
  if (!runtimePromise) {
    runtimePromise = loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.29.5/full/"
    }).then((pyodide) => {
      pyodide.setStdout({ batched: (text) => self.postMessage({ type: "stdout", text }) });
      pyodide.setStderr({ batched: (text) => self.postMessage({ type: "stderr", text }) });
      return pyodide;
    });
  }
  return runtimePromise;
}

self.onmessage = async (event) => {
  const { id, code } = event.data || {};
  if (typeof code !== "string") return;

  try {
    self.postMessage({ type: "status", id, message: "Preparing Python…" });
    const pyodide = await getRuntime();
    self.postMessage({ type: "status", id, message: "Running code…" });

    const result = await pyodide.runPythonAsync(code);
    if (result !== undefined) {
      let printable;
      try {
        printable = result.toString();
      } catch {
        printable = String(result);
      }
      if (printable && printable !== "None") {
        self.postMessage({ type: "result", id, text: printable });
      }
      if (result && typeof result.destroy === "function") result.destroy();
    }
    self.postMessage({ type: "done", id });
  } catch (error) {
    self.postMessage({ type: "error", id, text: error && error.message ? error.message : String(error) });
  }
};
