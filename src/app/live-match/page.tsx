"use client";

import { useEffect, useState } from "react";

interface MatchData {
  type?: string;
  match_id?: number;
  home_score?: number;
  away_score?: number;
  current_minute?: number;
  status?: string;
}

export default function LiveMatchPage() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  const [match, setMatch] = useState<MatchData>({
    match_id: 1,
    home_score: 0,
    away_score: 0,
    current_minute: 0,
    status: "scheduled",
  });

  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const ws = new WebSocket(
      "ws://127.0.0.1:8000/ws/matches/1"
    );

    ws.onopen = () => {
      console.log("WebSocket connected");

      setConnected(true);
      setSocket(ws);

      setMessages((previous) => [
        ...previous,
        "Connected to live match",
      ]);
    };

    ws.onmessage = (event) => {
      try {
        const data: MatchData = JSON.parse(event.data);

        console.log("Live update:", data);

        setMatch((previous) => ({
          ...previous,
          ...data,
        }));

        setMessages((previous) => [
          ...previous,
          JSON.stringify(data),
        ]);
      } catch (error) {
        console.error(
          "Invalid WebSocket message:",
          error
        );
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");

      setConnected(false);
      setSocket(null);

      setMessages((previous) => [
        ...previous,
        "Disconnected from live match",
      ]);
    };

    ws.onerror = () => {
      console.error("WebSocket error");

      setMessages((previous) => [
        ...previous,
        "WebSocket error",
      ]);
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendTestUpdate = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return;
    }

    const update = {
      type: "score_update",
      match_id: 1,
      home_score: match.home_score,
      away_score: match.away_score,
      current_minute: match.current_minute,
    };

    socket.send(JSON.stringify(update));
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>KingsBet Live Match</h1>

      <p>
        WebSocket Status:{" "}
        <strong>
          {connected ? "Connected" : "Disconnected"}
        </strong>
      </p>

      <div
        style={{
          maxWidth: "500px",
          padding: "30px",
          border: "1px solid #ddd",
          borderRadius: "12px",
          marginTop: "30px",
        }}
      >
        <h2>Live Match #{match.match_id}</h2>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "30px",
          }}
        >
          <div>
            <h3>Home Team</h3>

            <p
              style={{
                fontSize: "40px",
                fontWeight: "bold",
              }}
            >
              {match.home_score}
            </p>
          </div>

          <div>
            <strong>VS</strong>
          </div>

          <div>
            <h3>Away Team</h3>

            <p
              style={{
                fontSize: "40px",
                fontWeight: "bold",
              }}
            >
              {match.away_score}
            </p>
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          <h3>
            Minute: {match.current_minute ?? 0}
          </h3>

          <p>
            Status: {match.status}
          </p>
        </div>

        <button
          onClick={sendTestUpdate}
          disabled={!connected}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "20px",
            cursor: connected
              ? "pointer"
              : "not-allowed",
          }}
        >
          Send Test Update
        </button>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h2>WebSocket Messages</h2>

        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          messages.map((message, index) => (
            <p key={index}>
              {message}
            </p>
          ))
        )}
      </div>
    </main>
  );
}