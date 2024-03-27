"use client";
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { emotionConfig } from "./config";
import { ColorRing } from "react-loader-spinner";

export default function Home() {
  const defaultColor = "#cccccc";
  const [rows, setRows] = useState(2);
  const [input, setinput] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<{ label: string; score: number }[]>();
  const [color, setColor] = useState(defaultColor);
  const [tagsVisible, setTagsVisible] = useState(false);

  useEffect(() => {
    const inputTimeout = setTimeout(() => {
      runPredictions();
    }, 1000);

    return () => {
      clearTimeout(inputTimeout);
    };
  }, [input]);

  useEffect(() => {
    handleColor();
    setTagsVisible(true);
  }, [output]);

  function handleColor() {
    if (output && output.length > 0) {
      const colorKey = (output as any[])[0].label;
      const colorHex = (emotionConfig as any)[colorKey].colorHex;
      setColor(colorHex);
    }
  }

  async function runPredictions() {
    if (input) {
      setLoading(true);
      setTagsVisible(false);
      const res = await axios.post("api/emotion", { input });
      setOutput(res.data.filteredResponse);
      setLoading(false);
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLTextAreaElement>): void {
    setinput(event.target.value);
    const newRows = Math.max(1, Math.ceil(event.target.scrollHeight / 20));
    setRows(newRows);
  }

  return (
    <main
      style={{ backgroundColor: color + "aa" }}
      className="transition-all delay-500 gap-4 flex min-h-screen flex-col items-center p-24"
    >
      <h1 className="lg:text-4xl text-3xl font-mono font-semibold tracking-tight">
        🖌️ Paint My Mood 🎨
      </h1>
      <div className="w-1/2 min-w-80 border-2 border-black p-4 rounded-lg">
        <textarea
          rows={rows}
          onChange={handleInputChange}
          placeholder="Type How you feel . . . "
          className="resize-none outline-none block w-full text-sm placeholder-slate-600 bg-transparent"
        ></textarea>
      </div>
      <p>{">" + " " + input}</p>
      <div className="flex flex-wrap items-center justify-center gap-2 ">
        {output?.map(({ label, score }) => (
          <span
            style={{ opacity: tagsVisible ? 1 : 0 }}
            key={label}
            className="cursor-pointer bg-indigo-100 text-indigo-400 text-lg px-4 py-1 rounded-full border-indigo-400"
          >
            {label} {(emotionConfig as any)[label].emoji}
          </span>
        ))}
      </div>
      {loading && renderLoader()}
    </main>
  );
  function renderLoader() {
    return (
      <ColorRing
        visible={true}
        height="80"
        width="80"
        ariaLabel="color-ring-loading"
        wrapperStyle={{}}
        wrapperClass="color-ring-wrapper"
        colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
      />
    );
  }
}
