-- AlterTable
ALTER TABLE "video_topics" 
  DROP COLUMN IF EXISTS "difficulty",
  DROP COLUMN IF EXISTS "certification_objective",
  DROP COLUMN IF EXISTS "order_index",
  ALTER COLUMN "transcript_excerpt" DROP NOT NULL,
  ALTER COLUMN "key_concepts" SET DEFAULT '[]'::jsonb,
  ALTER COLUMN "key_concepts" SET NOT NULL,
  ALTER COLUMN "highlights" SET DEFAULT '[]'::jsonb,
  ALTER COLUMN "highlights" SET NOT NULL;

-- CreateTable
CREATE TABLE IF NOT EXISTS "topic_skill_maps" (
    "id" TEXT NOT NULL,
    "topic_id" TEXT NOT NULL,
    "skill_id" TEXT NOT NULL,
    "skill_name" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "topic_skill_maps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "topic_skill_maps_topic_id_idx" ON "topic_skill_maps"("topic_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "topic_skill_maps_skill_id_idx" ON "topic_skill_maps"("skill_id");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "topic_skill_maps_topic_id_skill_id_key" ON "topic_skill_maps"("topic_id", "skill_id");

-- AddForeignKey
ALTER TABLE "topic_skill_maps" ADD CONSTRAINT "topic_skill_maps_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "video_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
