import { Cascade, EntitySchema } from '@mikro-orm/core';
import { Partner } from '../../domain/entities/partner.entity';
import { PartnerIdSchemaType } from './types/partner-id.schema-type';
import { Customer } from '../../domain/entities/customer.entity';
import { CustomerIdSchemaType } from './types/customer-id.schema-type';
import { CpfSchemaType } from './types/cpf.schema-type';
import {Event} from '../../domain/entities/event.entity'
import { EventIdSchemaType } from './types/event-id.schema-type';
import { EventSection } from '../../domain/entities/event-section';
import { EventSectionIdSchemaType } from './types/event-section-id.schema-type';
import { EventSpot } from '../../domain/entities/event-spot';
import { EventSpotIdSchemaType } from './types/event-spot-id.schema-type';

export const PartnerSchema = new EntitySchema<Partner>({
  class: Partner,
  properties: {
    id: { primary: true, type: PartnerIdSchemaType },
    name: { type: 'string', length: 255 },
  },
});

export const CustomerSchema = new EntitySchema<Customer>({
  class: Customer,
  uniques: [{ properties: ['cpf'] }],
  properties: {
    id: {
      type: CustomerIdSchemaType,
      primary: true,
    },
    cpf: { type: CpfSchemaType },
    name: { type: 'string', length: 255 },
  },
});

export const EventSchema = new EntitySchema<Event>({
  class: Event,
  properties: {
    id: {
      primary: true,
      type: EventIdSchemaType,
    },
    name: { type: 'string', length: 255 },
    description: { type: 'text', nullable: true },
    date: { type: 'date' },
    is_published: { type: 'boolean', default: false },
    total_spots: { type: 'number', default: 0 },
    total_spots_reserved: { type: 'number', default: 0 },
    sections: {
      kind: '1:m',
      entity: () => EventSection,
      mappedBy: (section) => section.event_id, // TODO fix realationship
      eager: true,
      cascade: [Cascade.ALL],
    },
    partner_id: {
      kind: 'm:1',
      entity: () => Partner,
      mapToPk: true,
      type: PartnerIdSchemaType,
    },
  },
});

export const EventSectionSchema = new EntitySchema<EventSection>({
  class: EventSection,
  properties: {
    id: {
      type: EventSectionIdSchemaType,
      primary: true,
    },
    name: { type: 'string', length: 255 },
    description: { type: 'text', nullable: true },
    is_published: { type: 'boolean', default: false },
    total_spots: { type: 'number', default: 0 },
    total_spots_reserved: { type: 'number', default: 0 },
    price: { type: 'number', default: 0 },
    spots: {
      kind: '1:m',
      entity: () => EventSpot,
      mappedBy: section => section.event_section_id,// TODO fix realationship
      eager: true,
      cascade: [Cascade.ALL],
    },
    event_id: {// TODO fix realationship
      reference: 'm:1',
      entity: () => Event,
      hidden: true,
      mapToPk: true,
      type: EventIdSchemaType,
    },
  },
});

export const EventSpotSchema = new EntitySchema<EventSpot>({
  class: EventSpot,
  properties: {
    id: {
      type: EventSpotIdSchemaType,
      primary: true,
    },
    location: { type: 'string', length: 255, nullable: true },
    is_reserved: { type: 'boolean', default: false },
    is_published: { type: 'boolean', default: false },
    event_section_id: {// TODO fix realationship
      kind: 'm:1',
      entity: () => EventSection,
      hidden: true,
      mapToPk: true,
      type: new EventSectionIdSchemaType(),
    },
  },
});