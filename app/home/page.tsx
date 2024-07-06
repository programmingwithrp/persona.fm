"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/header";
import Recents from "../components/recents";
import Loading from "../components/loading";
import Tabs from "../components/tabs";
import { getCookies } from "../cookies";

export default function Page() {
  const [recentTracks, setRecentTracks] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>("recent-tracks");
  const [loading, setLoading] = useState<boolean>(true);

  function getRecentTracks(username: string) {
    axios
      .get(`https://ws.audioscrobbler.com/2.0/`, {
        params: {
          method: "user.getRecentTracks",
          user: username,
          api_key: process.env.NEXT_PUBLIC_API_KEY,
          format: "json",
        },
      })
      .then((response) => {
        console.log(response.data);
        setRecentTracks(response.data.recenttracks.track);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function switchTab(tab: string) {
    setActiveTab(tab);
  }

  useEffect(() => {
    const cookieList = getCookies();
    if (cookieList != undefined) {
      getRecentTracks(cookieList[1] || "");
      return;
    } else {
      window.location.href = `${process.env.NEXT_PUBLIC_CALLBACK_URL}`;
    }
  }, []);

  return (
    <div className="container mx-auto">
      <br />
      <br />
      <Tabs activeTab={activeTab} switchTab={switchTab} />
      <br />
      {loading && <Loading />}
      {activeTab === "recent-tracks" && <Recents recentTracks={recentTracks} />}
    </div>
  );
}
