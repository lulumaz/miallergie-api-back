import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor,
  HasManyRepositoryFactory, HasOneRepositoryFactory} from '@loopback/repository';
import {
  Recipe,
  RecipeRelations,
  Diet,
  RecipeAllergy,
  RecipeIntolerance,
  Ingredient, File} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {DietRepository} from './diet.repository';
import {RecipeAllergyRepository} from './recipe-allergy.repository';
import {RecipeIntoleranceRepository} from './recipe-intolerance.repository';
import {IngredientRepository} from './ingredient.repository';
import {FileRepository} from './file.repository';

export class RecipeRepository extends DefaultCrudRepository<
  Recipe,
  typeof Recipe.prototype.id,
  RecipeRelations
> {
  public readonly diet: BelongsToAccessor<Diet, typeof Recipe.prototype.id>;

  public readonly recipeAllergies: HasManyRepositoryFactory<
    RecipeAllergy,
    typeof Recipe.prototype.id
  >;

  public readonly recipeIntolerances: HasManyRepositoryFactory<
    RecipeIntolerance,
    typeof Recipe.prototype.id
  >;

  public readonly ingredients: HasManyRepositoryFactory<
    Ingredient,
    typeof Recipe.prototype.id
  >;

  public readonly file: HasOneRepositoryFactory<File, typeof Recipe.prototype.id>;

  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource,
    @repository.getter('DietRepository')
    protected dietRepositoryGetter: Getter<DietRepository>,
    @repository.getter('RecipeAllergyRepository')
    protected recipeAllergyRepositoryGetter: Getter<RecipeAllergyRepository>,
    @repository.getter('RecipeIntoleranceRepository')
    protected recipeIntoleranceRepositoryGetter: Getter<
      RecipeIntoleranceRepository
    >,
    @repository.getter('IngredientRepository')
    protected ingredientRepositoryGetter: Getter<IngredientRepository>, @repository.getter('FileRepository') protected fileRepositoryGetter: Getter<FileRepository>,
  ) {
    super(Recipe, dataSource);
    this.file = this.createHasOneRepositoryFactoryFor('file', fileRepositoryGetter);
    this.registerInclusionResolver('file', this.file.inclusionResolver);
    this.ingredients = this.createHasManyRepositoryFactoryFor(
      'ingredients',
      ingredientRepositoryGetter,
    );
    this.registerInclusionResolver(
      'ingredients',
      this.ingredients.inclusionResolver,
    );
    this.recipeIntolerances = this.createHasManyRepositoryFactoryFor(
      'recipeIntolerances',
      recipeIntoleranceRepositoryGetter,
    );
    this.registerInclusionResolver(
      'recipeIntolerances',
      this.recipeIntolerances.inclusionResolver,
    );
    this.recipeAllergies = this.createHasManyRepositoryFactoryFor(
      'recipeAllergies',
      recipeAllergyRepositoryGetter,
    );
    this.registerInclusionResolver(
      'recipeAllergies',
      this.recipeAllergies.inclusionResolver,
    );
    this.diet = this.createBelongsToAccessorFor('diet', dietRepositoryGetter);
    this.registerInclusionResolver('diet', this.diet.inclusionResolver);
  }
}
