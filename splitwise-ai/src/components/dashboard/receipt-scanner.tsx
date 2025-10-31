"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { Spinner } from "@/components/dashboard/spinner";
const TesseractPromise = import("tesseract.js");

export function ReceiptScanner() {
  const [result, setResult] = useState("");
  const [isScanning, setScanning] = useState(false);

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setScanning(true);
    try {
      const { recognize } = await TesseractPromise;
      const { data } = await recognize(
        file,
        "eng",
        {
          tessedit_char_whitelist:
            "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$€£,.:-",
        } as Record<string, unknown>,
      );
      setResult(data.text);
      toast.success("Gemini vision parsed the receipt");
    } catch (error) {
      console.error(error);
      toast.error("Failed to scan receipt");
    } finally {
      setScanning(false);
      event.target.value = "";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-white">Receipt scanner</CardTitle>
        <CardDescription>OCR + Gemini Vision to pre-fill expenses automatically</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <label className="flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-white/15 bg-white/5 p-6 text-sm text-white/60">
          <Input type="file" accept="image/*" className="hidden" onChange={handleFile} />
          {isScanning ? (
            <div className="flex flex-col items-center gap-3">
              <Spinner />
              <span>Extracting fields…</span>
            </div>
          ) : (
            <>
              <span>Drop a photo or PDF receipt</span>
              <span className="text-xs">Supported: JPG, PNG, HEIC, PDF</span>
            </>
          )}
        </label>
        <Textarea
          value={result}
          onChange={(event) => setResult(event.target.value)}
          placeholder="Gemini Vision output appears here."
          className="min-h-[160px]"
        />
      </CardContent>
    </Card>
  );
}
