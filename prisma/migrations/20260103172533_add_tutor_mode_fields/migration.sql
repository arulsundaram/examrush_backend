-- AlterTable
ALTER TABLE "video_topics" ADD COLUMN     "exam_angle_notes" TEXT,
ADD COLUMN     "highlights" JSONB,
ADD COLUMN     "key_concepts" JSONB,
ADD COLUMN     "tech_tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "lab_completions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "lab_id" TEXT NOT NULL,
    "topic_id" TEXT NOT NULL,
    "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lab_completions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topic_engagements" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "topic_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "topic_engagements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_mastery" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "skill_id" TEXT NOT NULL,
    "skill_name" TEXT NOT NULL,
    "mastery_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "confidence" TEXT,
    "last_assessed_at" TIMESTAMP(3),
    "last_prompt_used" TIMESTAMP(3),

    CONSTRAINT "skill_mastery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lab_completions_user_id_lab_id_key" ON "lab_completions"("user_id", "lab_id");

-- CreateIndex
CREATE INDEX "topic_engagements_user_id_topic_id_idx" ON "topic_engagements"("user_id", "topic_id");

-- CreateIndex
CREATE INDEX "skill_mastery_user_id_idx" ON "skill_mastery"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "skill_mastery_user_id_skill_id_key" ON "skill_mastery"("user_id", "skill_id");

-- AddForeignKey
ALTER TABLE "lab_completions" ADD CONSTRAINT "lab_completions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_completions" ADD CONSTRAINT "lab_completions_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "video_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic_engagements" ADD CONSTRAINT "topic_engagements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic_engagements" ADD CONSTRAINT "topic_engagements_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "video_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_mastery" ADD CONSTRAINT "skill_mastery_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
