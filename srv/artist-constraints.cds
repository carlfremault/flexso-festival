using {festival} from '../db/schema';


annotate festival.Artists with @assert.unique.deezerId: [deezerId] {
    deezerId @mandatory;
    name     @mandatory;
}
