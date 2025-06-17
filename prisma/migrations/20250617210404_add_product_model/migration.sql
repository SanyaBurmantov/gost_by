-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "price" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "keywords" TEXT,
    "subtitle" VARCHAR(255),
    "brand" VARCHAR(100),
    "material" VARCHAR(100),
    "weight" VARCHAR(50),
    "dimensions" VARCHAR(50),
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "images" TEXT[],

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);
