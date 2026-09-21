using {festival} from './schema';

// constraints applicable to all services

annotate festival.Artists with @assert.unique.deezerId: [deezerId] {
    deezerId @mandatory;
    name     @mandatory;
}
