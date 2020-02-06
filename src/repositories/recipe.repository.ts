import {RecipeFood} from './../models/recipe-food.model';
import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {Recipe, RecipeRelations, Diet, Allergy, Intolerance} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {DietRepository} from './diet.repository';
import {RecipeFoodRepository} from './recipe-food.repository';
import {AllergyRepository} from './allergy.repository';
import {IntoleranceRepository} from './intolerance.repository';

export class RecipeRepository extends DefaultCrudRepository<
  Recipe,
  typeof Recipe.prototype.id,
  RecipeRelations
> {
  public readonly diet: BelongsToAccessor<Diet, typeof Recipe.prototype.id>;

  public readonly recipeFoods: HasManyRepositoryFactory<
    RecipeFood,
    typeof Recipe.prototype.id
  >;

  public readonly allergies: HasManyRepositoryFactory<
    Allergy,
    typeof Recipe.prototype.id
  >;

  public readonly intolerances: HasManyRepositoryFactory<
    Intolerance,
    typeof Recipe.prototype.id
  >;

  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource,
    @repository.getter('DietRepository')
    protected dietRepositoryGetter: Getter<DietRepository>,
    @repository.getter('RecipeFoodRepository')
    protected recipeFoodRepositoryGetter: Getter<RecipeFoodRepository>,
    @repository.getter('AllergyRepository')
    protected allergyRepositoryGetter: Getter<AllergyRepository>,
    @repository.getter('IntoleranceRepository')
    protected intoleranceRepositoryGetter: Getter<IntoleranceRepository>,
  ) {
    super(Recipe, dataSource);
    this.intolerances = this.createHasManyRepositoryFactoryFor(
      'intolerances',
      intoleranceRepositoryGetter,
    );
    this.registerInclusionResolver(
      'intolerances',
      this.intolerances.inclusionResolver,
    );
    this.allergies = this.createHasManyRepositoryFactoryFor(
      'allergies',
      allergyRepositoryGetter,
    );
    this.registerInclusionResolver(
      'allergies',
      this.allergies.inclusionResolver,
    );
    this.recipeFoods = this.createHasManyRepositoryFactoryFor(
      'recipeFoods',
      recipeFoodRepositoryGetter,
    );
    this.registerInclusionResolver(
      'recipeFoods',
      this.recipeFoods.inclusionResolver,
    );
    this.diet = this.createBelongsToAccessorFor('diet', dietRepositoryGetter);
    this.registerInclusionResolver('diet', this.diet.inclusionResolver);
  }
}
