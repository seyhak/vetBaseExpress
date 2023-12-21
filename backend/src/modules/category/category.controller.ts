import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";

@Controller("categories")
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<any> {
    this.categoryService.create()
    try {
      const created = await Category.create({
        name,
        description
      });
      return JSON.stringify(created.dataValues);
    } catch (err) {
      return err;
    }
  }

  @Get()
  async getList(): string[] {
    const where = searchPhase
      ? {
          [Op.or]: [
            Sequelize.where(Sequelize.fn("UPPER", Sequelize.col("name")), {
              [Op.substring]: searchPhase
            }),
            Sequelize.where(
              Sequelize.fn("UPPER", Sequelize.col("description")),
              {
                [Op.substring]: searchPhase
              }
            )
          ]
        }
      : {};

    const items = await Category.findAll({
      attributes: ["id", "name", "description", "createdAt", "updatedAt"],
      where
    });

    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
    return items.map((item) => ({
      ...item.dataValues,
      createdAt: item.createdAt.toString(),
      updatedAt: item.updatedAt.toString()
    }));
  }

  @Get(":id")
  async details(@Param("id") id: string): Promise<any> {
    return 123;
  }

  @Delete(":id")
  async deleteCategory(@Param("id") id: string): Promise<string> {
    return "Deletion successful";
  }

  @Patch("id")
  async updateCategory(@Param("id") id: string): Promise<any> {
    return "Deletion successful";
  }
}
