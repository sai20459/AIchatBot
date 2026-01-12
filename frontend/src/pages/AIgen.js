import Image from "next/image";
import { useRef, useState } from "react";
import bot from "../assets/bot.svg";
import user from "../assets/user.svg";
import send from "../assets/send.svg";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const uniqueId = () =>
  `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const presetPrompts = [
  "Explain the concept of eigenvalues and eigenvectors step by step for a beginner student. Include geometric intuition, transformation examples, and step by step matrix calculations. Provide a dataset of simple matrices and include charts that help visualise transformations in two dimensions.",
  "Generate complete structured content describing how to model long term climate risk using spatiotemporal forecasting across land temperature, ocean salinity, and atmospheric pressure. Include dataset with columns for region, month, temperature anomaly, and pressure index across multiple years. Provide chart specifications for spatial maps, anomaly trajectories, and scenario comparisons. Explain autoregressive spatial models, ensemble methods for uncertainty, and climate drift",
  "Explain how to build a fully distributed OLAP query engine similar to Apache Druid or Clickhouse. Break down segment files, vectorised execution, bitmap indexes, aggregation pushdown, and multi stage query planning. Include example SQL for rollups and time based queries. Provide dataset and charts showing ingestion throughput, query latency, and memory usage",
  "Create structured content that describes a blockchain consensus algorithm where nodes randomly change roles, messages can arrive out of order, and transaction hashes can be strings or numbers. Include a dataset showing this inconsistent behaviour. Need code for demonstrating the algorithm in TypeScript.",
  "Explain how to design a SOC level two security automation workflow including detection engineering, enrichment pipelines, alert triage, threat scoring, and automated containment. Provide dataset of event logs and charts showing event category distribution.",
];
const PALETTE = [
  "#60A5FA",
  "#34D399",
  "#FBBF24",
  "#F87171",
  "#A78BFA",
  "#22D3EE",
  "#FB7185",
  "#F97316",
];

function colorByIndex(i) {
  return PALETTE[i % PALETTE.length];
}
export default function AIgen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);
  const loaderRef = useRef(null);

  function toObjects(dataset) {
    const cols = dataset.columns;
    return dataset?.rows?.map((row) => {
      const obj = {};
      cols.forEach((c, i) => {
        obj[c] = row[i];
      });
      return obj;
    });
  }

  function JsonBlock({ data }) {
    const jsonText = JSON.stringify(data, null, 2);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      navigator.clipboard.writeText(jsonText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    };

    return (
      <div className="relative bg-black/60 rounded p-3 mt-2">
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 text-xs bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded"
        >
          {copied ? "Copied!" : "Copy"}
        </button>

        <pre className="text-green-300 text-xs overflow-x-auto whitespace-pre-wrap pt-6">
          {jsonText}
        </pre>
      </div>
    );
  }

  function DatasetTable({ dataset }) {
    if (!dataset) return null;
    return (
      <div className="mt-4 bg-black/40 rounded p-3 text-xs overflow-x-auto">
        <div className="font-semibold mb-2">Dataset</div>
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr>
              {dataset?.columns?.map((c) => (
                <th key={c} className="border px-2 py-1">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataset?.rows?.map((row, rIdx) => (
              <tr key={rIdx}>
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="border px-2 py-1">
                    {String(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function ChartsView({ dataset, charts }) {
    if (!dataset || !charts || charts.length === 0) return null;

    const data = toObjects(dataset);

    return (
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {charts.map((chart, index) => {
          if (chart.chart_type === "bar") {
            return (
              <div
                key={chart.chart_id}
                className="bg-black/40 rounded p-3 h-64"
              >
                <div className="font-semibold mb-2">{chart.title}</div>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={chart.x_field} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey={chart.y_field} fill={colorByIndex(index)} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            );
          }

          if (chart.chart_type === "line") {
            return (
              <div
                key={chart.chart_id}
                className="bg-black/40 rounded p-3 h-64"
              >
                <div className="font-semibold mb-2">{chart.title}</div>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={chart.x_field} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey={chart.y_field}
                      dot={false}
                      stroke={colorByIndex(index)}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            );
          }
          if (chart.chart_type === "scatter") {
            return (
              <div
                key={chart.chart_id}
                className="bg-black/40 rounded p-3 h-64"
              >
                <div className="font-semibold mb-2">{chart.title}</div>
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={chart.x_field} />
                    <YAxis dataKey={chart.y_field} />
                    <Tooltip />
                    <Legend />
                    <Scatter
                      data={data}
                      dataKey={chart.y_field}
                      fill={colorByIndex(index)}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            );
          }

          if (chart.chart_type === "pie") {
            return (
              <div
                key={chart.chart_id}
                className="bg-black/40 rounded p-3 h-64"
              >
                <div className="font-semibold mb-2">{chart.title}</div>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip />
                    <Legend />
                    <Pie
                      data={data}
                      dataKey={chart.y_field}
                      nameKey={chart.x_field}
                      outerRadius="80%"
                    >
                      {data.map((_, i) => (
                        <Cell key={i} fill={colorByIndex(i)} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            );
          }

          return null;
        })}
      </div>
    );
  }

  const scrollToBottom = () => {
    if (chatRef.current)
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
  };

  const startLoader = (el) => {
    el.textContent = "";
    let dots = "";
    loaderRef.current = setInterval(() => {
      dots = dots.length >= 3 ? "" : dots + ".";
      el.textContent = dots;
    }, 300);
  };

  const stopLoader = () => {
    if (loaderRef.current) {
      clearInterval(loaderRef.current);
      loaderRef.current = null;
    }
  };

  const typeText = (el, text, onDone) => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        el.innerHTML += text.charAt(i);
        i++;
        scrollToBottom();
      } else {
        clearInterval(interval);
        onDone && onDone();
      }
    }, 20);
  };

  const handleSubmit = async (prompt) => {
    if (!prompt) return;

    setIsTyping(true);

    const userMsg = { id: uniqueId(), role: "user", content: prompt };
    const botMsg = { id: uniqueId(), role: "assistant", content: "" };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
    setTimeout(scrollToBottom, 0);

    setTimeout(() => {
      const botEl = document.getElementById(botMsg.id);
      if (botEl) startLoader(botEl);
    }, 0);
    setIsTyping(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      stopLoader();
      const botEl = document.getElementById(botMsg.id);

      if (!res.ok) {
        const msg = "Something went wrong!";
        if (botEl) {
          botEl.textContent = msg;
        } else {
          setMessages((prev) =>
            prev.map((m) => (m.id === botMsg.id ? { ...m, content: msg } : m))
          );
        }
        setIsTyping(false);
        return;
      }

      const data = await res.json();
      const d = data?.response?.data || data?.data || {};
      const combined_output = data?.response;
      const segments = d.analysis_blocks || [];
      const dataset = d.dataset;
      const charts = d.charts || [];

      const text = segments.map((seg, idx) => {
        const tips =
          seg.general_tips && seg.general_tips.length
            ? "\nTips:\n- " + seg.general_tips.join("\n- ")
            : "";

        return (
          `Segment ${idx + 1}:\n\n` +
          `Explanation:\n${seg.explanation}\n\n` +
          `Content:\n${seg.raw_content}${tips}\n\n` +
          `Example Code:\n${seg.example_code}`
        );
      });

      if (!botEl) {
        botEl.textContent = "";
        typeText(botEl, text, () => setIsTyping(false));
      } else {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botMsg.id
              ? {
                  ...m,
                  content: text,
                  dataset,
                  charts,
                  combined_output,
                }
              : m
          )
        );
        setIsTyping(false);
      }
    } catch (err) {
      stopLoader();
      const botEl = document.getElementById(botMsg.id);
      const msg = "Network error!";
      if (botEl) botEl.textContent = msg;
      else {
        setMessages((prev) =>
          prev.map((m) => (m.id === botMsg.id ? { ...m, content: msg } : m))
        );
      }
      setIsTyping(false);
    }
  };

  return (
    <div>
      <div className="w-full mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
        {presetPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => handleSubmit(prompt)}
            disabled={isTyping}
            className="flex items-center gap-2 rounded px-3 py-2 bg-black/60 text-black text-lg backdrop-blur-md disabled:opacity-60"
          >
            <Image src={send} alt="send" width={20} height={20} />
            <span className="text-left">{prompt}</span>
          </button>
        ))}
      </div>
      {messages.length > 0 ? (
        <div
          // id="chat_container"
          ref={chatRef}
          className="w-full h-[70vh] overflow-y-auto rounded p-3 space-y-3"
        >
          {messages.map(
            (m) => (
              console.log(m, "mes  "),
              (
                <div
                  key={m.id}
                  className={`wrapper ${m.role === "assistant" ? "ai" : ""}`}
                >
                  <div className="chat flex gap-3 items-start">
                    <div className="profile shrink-0 w-8 h-8 rounded-full overflow-hidden border">
                      <Image
                        src={m.role === "assistant" ? bot : user}
                        alt={m.role === "assistant" ? "bot" : "user"}
                        width={32}
                        height={32}
                      />
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      <div
                        id={m.id}
                        className="message whitespace-pre-wrap leading-relaxed"
                      >
                        {m.content}
                      </div>

                      {m.role === "assistant" && (m.dataset || m.charts) && (
                        <>
                          <DatasetTable dataset={m.dataset} />
                          <ChartsView dataset={m.dataset} charts={m.charts} />
                        </>
                      )}
                      {m.role === "assistant" && m.combined_output && (
                        <>
                          <div className="rounded border  p-3">
                            <div className="text-sm font-semibold mb-2 text-black">
                              LLM 1 output
                            </div>
                            <JsonBlock data={m.combined_output.llm1data} />
                          </div>
                          <div className="rounded border p-3">
                            <div className="text-sm font-semibold mb-2 text-black">
                              LLM 2 output
                            </div>
                            <JsonBlock data={m.combined_output.data} />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            )
          )}
        </div>
      ) : null}
    </div>
  );
}
