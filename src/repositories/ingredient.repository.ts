import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Ingredient, IngredientRelations, Food, Unit} from '../models';
import {MongoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {FoodRepository} from './food.repository';
import {UnitRepository} from './unit.repository';

export class IngredientRepository extends DefaultCrudRepository<
  Ingredient,
  typeof Ingredient.prototype.id,
  IngredientRelations
> {

  public readonly food: BelongsToAccessor<Food, typeof Ingredient.prototype.id>;

  public readonly unitRelation: BelongsToAccessor<Unit, typeof Ingredient.prototype.id>;

  constructor(
    @inject('datasources.mongoDS') dataSource: MongoDsDataSource, @repository.getter('FoodRepository') protected foodRepositoryGetter: Getter<FoodRepository>, @repository.getter('UnitRepository') protected unitRepositoryGetter: Getter<UnitRepository>,
  ) {
    super(Ingredient, dataSource);
    this.unitRelation = this.createBelongsToAccessorFor('unitRelation', unitRepositoryGetter,);
    this.registerInclusionResolver('unitRelation', this.unitRelation.inclusionResolver);
    this.food = this.createBelongsToAccessorFor('food', foodRepositoryGetter,);
    this.registerInclusionResolver('food', this.food.inclusionResolver);
  }
}
