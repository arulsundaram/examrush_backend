-- AlterTable
ALTER TABLE "lab_completions" ALTER COLUMN "topic_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "exams" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_domains" (
    "id" TEXT NOT NULL,
    "exam_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "exam_domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_objectives" (
    "id" TEXT NOT NULL,
    "domain_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "skill_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "exam_objectives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_topics" (
    "id" TEXT NOT NULL,
    "exam_id" TEXT NOT NULL,
    "objective_id" TEXT NOT NULL,
    "topic_id" TEXT NOT NULL,

    CONSTRAINT "exam_topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "labs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "steps" JSONB NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "skill_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "topic_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "labs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drills" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "questions" JSONB NOT NULL,
    "skill_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "topic_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "drills_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "exams_code_key" ON "exams"("code");

-- CreateIndex
CREATE UNIQUE INDEX "exam_domains_exam_id_code_key" ON "exam_domains"("exam_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "exam_objectives_domain_id_code_key" ON "exam_objectives"("domain_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "exam_topics_exam_id_topic_id_key" ON "exam_topics"("exam_id", "topic_id");

-- AddForeignKey
ALTER TABLE "lab_completions" ADD CONSTRAINT "lab_completions_lab_id_fkey" FOREIGN KEY ("lab_id") REFERENCES "labs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_domains" ADD CONSTRAINT "exam_domains_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_objectives" ADD CONSTRAINT "exam_objectives_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "exam_domains"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_topics" ADD CONSTRAINT "exam_topics_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_topics" ADD CONSTRAINT "exam_topics_objective_id_fkey" FOREIGN KEY ("objective_id") REFERENCES "exam_objectives"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_topics" ADD CONSTRAINT "exam_topics_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "video_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
