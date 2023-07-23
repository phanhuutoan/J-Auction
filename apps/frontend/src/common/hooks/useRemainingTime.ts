/* eslint-disable react-hooks/exhaustive-deps */
import moment from "moment";
import { useEffect, useState } from "react";

export const useRemainingTime = (remainingTimeInMinutes: number) => {
  const [formatStr, setFormatStr] = useState("");

  let remainingAsMilisec = 0;
  useEffect(() => {
    _calculateRemainingTimeMiliSec(remainingTimeInMinutes);
    setFormatStr(moment(remainingAsMilisec).format("mm:ss"));

    const interval = setInterval(() => {
      remainingAsMilisec -= 1000;
      setFormatStr(moment(remainingAsMilisec).format("mm:ss"));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  function _calculateRemainingTimeMiliSec(minutes: number) {
    const now = moment();
    const endTime = moment().add(minutes, "minutes");

    remainingAsMilisec = endTime.valueOf() - now.valueOf();
  }

  return {
    formatStr,
  };
};
