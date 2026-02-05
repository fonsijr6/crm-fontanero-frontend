import { getMongoDateMoment } from '../../../../../utils/get-mongo-date';
import { Client, ClientCardVm, LatestClient } from '../models/client';

function buildFullName(client: Client): string {
  // Evita dobles espacios si surname2 no existe
  return [client.name, client.surname1, client.surname2].filter(Boolean).join(' ').trim();
}

export class ClientMapper {
  /**
   * mapeamos de Client de back a client que visualizaremos en las cards de clientes
   * @param {Client} client
   * @returns {ClientCardVm}
   */
  static toClientCardVm(client: Client): ClientCardVm {
    return {
      _id: client._id,
      name: buildFullName(client),
      phone: client.phone,
      address: client.address,
      notes: client.notes?.trim() ?? '', // normaliza a string
    };
  }

  /**
   * mapeamos de Client de back a client que visualizaremos en la tabla de últimos clientes
   * @param {Client} client
   * @returns {LatestClient}
   */
  static toLatestClient(client: Client): LatestClient {
    return {
      _id: client._id,
      name: buildFullName(client),
      phone: client.phone,
      address: client.address,
      createdAt: getMongoDateMoment(client._id),
    };
  }
}
