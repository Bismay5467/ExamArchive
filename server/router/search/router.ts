import GetPapers from '../../controllers/search/GetPapers';
import { searchInputSchema } from './schema';
import { publicProcedures, router } from '../../config/trpcConfig';

const searchRouter = router({
  get: publicProcedures.input(searchInputSchema).query(async ({ input }) => {
    const searchResults = await GetPapers(input);
    return { results: searchResults };
  }),
});

export default searchRouter;
