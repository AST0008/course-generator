import { Chapter, Unit, Course } from "@prisma/client";

type Props = {
  chapterIndex: number;
  unit: Unit;
  chapter: Chapter;
  unitIndex: number;
};

const MainVideoSummary = (props: Props) => {
  const { chapterIndex, unit, chapter, unitIndex } = props;
  return (
    <div className="flex-[2] mt-15">
      <h4 className="text-sm uppercase text-secondary-foreground/60">
        Unit {unitIndex + 1} &bull; Chapter {chapterIndex + 1}
      </h4>
      <h1 className="text-4xl font-bold">{chapter.name}</h1>
      <iframe
        title="Chapter Video"
        src={`https://www.youtube.com/embed/${chapter.videoId}`}
        className="w-full h-[500px] rounded-lg"
        allowFullScreen
      />
      <div className="mt-4">
        <h3 className="text-3xl font-semibold">Summary</h3>
        <p className=" mt-2 text-secondary-foreground/60">{chapter.summary}</p>
      </div>
    </div>
  );
};

export default MainVideoSummary;
