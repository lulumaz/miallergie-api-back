import {UserRoleRelations} from './models/user-role.model';
import {User, UserRelations} from './models/user.model';
import {UserRoleRepository} from './repositories/user-role.repository';
import {Role} from './models/role.model';
import {RoleRepository} from './repositories/role.repository';
import {UserRepository} from './repositories/user.repository';
import {MongoDsDataSource} from './datasources';
import {Count} from '@loopback/repository';
import {UserRole} from './models';
const bcrypt = require('bcrypt');
//permet de remplir la base avec les données nécéssaire au foncitonnement de l'api

const exec = async function() {
  const mongoDsDataSource: MongoDsDataSource = new MongoDsDataSource();

  //repositories
  const userRepository: UserRepository = new UserRepository(mongoDsDataSource);
  const roleRepository: RoleRepository = new RoleRepository(mongoDsDataSource);
  const userRoleRepository: UserRoleRepository = new UserRoleRepository(
    mongoDsDataSource,
  );

  //création d'un role admin, classic
  const roleList: Partial<Role>[] = [
    {
      id: 'Classic',
      description: "Compte utilisateur de base lors de la création d'un compte",
    },
    {
      id: 'Admin',
      description: 'Compte avec le plus de droit',
    },
  ];
  for (const role of roleList) {
    const hasRole: Count = await roleRepository.count({
      id: role.id,
    });
    if (hasRole.count === 0) {
      try {
        await roleRepository.create({
          id: role.id,
          description: role.description,
        });
      } catch (error) {
        console.error('error role create ', error);
      }
    }
  }
  //création d'un compte utilisateur ayant le role admin
  //Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('administrator', salt);
  const password = hashedPassword;
  const unserAdmin: Partial<User> = {
    email: 'miallergie@gmail.com',
    username: 'admin',
    password: password,
  };

  try {
    let user: (User & UserRelations) | null = await userRepository.findOne({
      where: {
        email: unserAdmin.email,
        username: unserAdmin.username,
      },
    });
    if (!user) user = await userRepository.create(unserAdmin); //if user does't exist then create it
    //adding role to user
    const nUserRole: Partial<UserRole> = {
      roleId: 'Admin',
      userId: user.id,
    };

    const userRole:
      | (UserRole & UserRoleRelations)
      | null = await userRoleRepository.findOne(
      {
        where: {
          roleId: nUserRole.roleId,
          userId: user.id,
        },
      },
      {strictObjectIDCoercion: true},
    );
    if (!userRole) await userRoleRepository.create(nUserRole); //if role is not link then link it
  } catch (error) {
    console.error('error role create ', error);
  }

  process.exit(); //fin du script
};

try {
  exec();
} catch (error) {
  console.log('error global ', error);
}
