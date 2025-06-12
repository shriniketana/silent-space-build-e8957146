
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface CountdownTimerProps {
  endDate: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer = ({ endDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endDate.getTime() - new Date().getTime();
      
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    setTimeLeft(calculateTimeLeft());
    
    return () => clearInterval(timer);
  }, [endDate]);
  
  return (
    <Card className="bg-primary/5 border-0">
      <CardContent className="p-3">
        <div className="flex justify-center items-center space-x-3 text-sm">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-primary">{timeLeft.days}</div>
            <div className="text-xs text-muted-foreground">Days</div>
          </div>
          <div className="text-xl">:</div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-primary">{timeLeft.hours}</div>
            <div className="text-xs text-muted-foreground">Hours</div>
          </div>
          <div className="text-xl">:</div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-primary">{timeLeft.minutes}</div>
            <div className="text-xs text-muted-foreground">Min</div>
          </div>
          <div className="text-xl">:</div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-primary">{timeLeft.seconds}</div>
            <div className="text-xs text-muted-foreground">Sec</div>
          </div>
        </div>
        <div className="text-xs text-center mt-2 text-muted-foreground">Until polls close</div>
      </CardContent>
    </Card>
  );
};
