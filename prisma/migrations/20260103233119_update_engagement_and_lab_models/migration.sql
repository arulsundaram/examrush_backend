-- CreateEnum
CREATE TYPE "TopicEngagementType" AS ENUM ('View', 'Replay', 'PromptSearch');

-- AlterTable: Rename labs to lab_exercises
ALTER TABLE "labs" RENAME TO "lab_exercises";

-- AlterTable: Remove topic_id from lab_completions
ALTER TABLE "lab_completions" DROP COLUMN IF EXISTS "topic_id";

-- AlterTable: Update topic_engagements event_type to enum
-- First, drop the old index if it exists
DROP INDEX IF EXISTS "topic_engagements_user_id_topic_id_idx";

-- Change event_type column to use the enum
ALTER TABLE "topic_engagements" 
  ALTER COLUMN "event_type" TYPE "TopicEngagementType" 
  USING "event_type"::"TopicEngagementType";

-- CreateIndex: Add new composite index with event_type
CREATE INDEX "topic_engagements_user_id_topic_id_event_type_idx" ON "topic_engagements"("user_id", "topic_id", "event_type");

