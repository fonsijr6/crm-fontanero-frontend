import { ObjectId } from 'bson';
import moment from 'moment';

export function getMongoDateMoment(id: string): moment.Moment {
  const creationDate = new ObjectId(id).getTimestamp();
  return moment(creationDate);
}
