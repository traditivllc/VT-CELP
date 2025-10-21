import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-cards"; // Not needed in Swiper v9+

import { EffectCards } from "swiper/modules";
import type { PromptRandQuestion } from "@/types/AssessmentTypes.types";

interface TestSliderProps {
  questions: PromptRandQuestion[];
}

export default function TestSlider({ questions }: TestSliderProps) {
  return (
    <div className="fixed top-0 left-0 z-3 backdrop-blur-lg bg-white/30 w-full h-full">
      <div className="max-w-sm mx-auto mt-20 p-4">
        <Swiper
          effect={"cards"}
          grabCursor={true}
          modules={[EffectCards]}
          className="mySwiper"
        >
          {questions.map((question, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white border border-solid border-grayscale-25 p-4 h-96 rounded-lg shadow-md text-center">
                <h3 className="text-lg font-semibold">{question.namePrefix}</h3>
                <h3 className="text-lg font-semibold">{question.name}</h3>
                <p>This is the content of slide {index + 1}.</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
