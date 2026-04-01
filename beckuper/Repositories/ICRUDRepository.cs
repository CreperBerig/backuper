namespace backuper.Repositories
{
    public interface ICRUDRepository<T>
    {
        Task<List<T>> GetAll();
        Task<T?> GetById(int id);
        Task<T> Create(T entity);
        Task<T?> Update(int id, T entity);
        Task<bool> DeleteById(int id);
    }
}
