import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {Recipe, RecipeRelations, Diet, Ingrediant, RecipeAllergy, RecipeIntolerance} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {DietRepository} from './diet.repository';
import {IngrediantRepository} from './ingrediant.repository';
import {RecipeAllergyRepository} from './recipe-allergy.repository';
import {RecipeIntoleranceRepository} from './recipe-intolerance.repository';

export class RecipeRepository extends DefaultCrudRepository<
  Recipe,
  typeof Recipe.prototype.id,
  RecipeRelations
> {

  public readonly diet: BelongsToAccessor<Diet, typeof Recipe.prototype.id>;

  public readonly ingrediants: HasManyRepositoryFactory<Ingrediant, typeof Recipe.prototype.id>;

  public readonly recipeAllergies: HasManyRepositoryFactory<RecipeAllergy, typeof Recipe.prototype.id>;

  public readonly recipeIntolerances: HasManyRepositoryFactory<RecipeIntolerance, typeof Recipe.prototype.id>;

  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource, @repository.getter('DietRepository') protected dietRepositoryGetter: Getter<DietRepository>, @repository.getter('IngrediantRepository') protected ingrediantRepositoryGetter: Getter<IngrediantRepository>, @repository.getter('RecipeAllergyRepository') protected recipeAllergyRepositoryGetter: Getter<RecipeAllergyRepository>, @repository.getter('RecipeIntoleranceRepository') protected recipeIntoleranceRepositoryGetter: Getter<RecipeIntoleranceRepository>,
  ) {
    super(Recipe, dataSource);
    this.recipeIntolerances = this.createHasManyRepositoryFactoryFor('recipeIntolerances', recipeIntoleranceRepositoryGetter,);
    this.registerInclusionResolver('recipeIntolerances', this.recipeIntolerances.inclusionResolver);
    this.recipeAllergies = this.createHasManyRepositoryFactoryFor('recipeAllergies', recipeAllergyRepositoryGetter,);
    this.registerInclusionResolver('recipeAllergies', this.recipeAllergies.inclusionResolver);
    this.ingrediants = this.createHasManyRepositoryFactoryFor('ingrediants', ingrediantRepositoryGetter,);
    this.registerInclusionResolver('ingrediants', this.ingrediants.inclusionResolver);
    this.diet = this.createBelongsToAccessorFor('diet', dietRepositoryGetter,);
    this.registerInclusionResolver('diet', this.diet.inclusionResolver);
  }
}
