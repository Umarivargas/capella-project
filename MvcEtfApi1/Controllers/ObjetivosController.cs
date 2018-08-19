using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using MvcEtfApi1.Models;

namespace MvcEtfApi1.Controllers
{
    public class ObjetivosController : ApiController
    {
        private AnalisisRiesgosConnect db = new AnalisisRiesgosConnect();

        // GET: api/Objetivos
        public IQueryable<Objetivo> GetObjetivoes()
        {
            return db.Objetivoes;
        }

        // GET: api/Objetivos/5
        [ResponseType(typeof(Objetivo))]
        public async Task<IHttpActionResult> GetObjetivo(int id)
        {
            Objetivo objetivo = await db.Objetivoes.FindAsync(id);
            if (objetivo == null)
            {
                return NotFound();
            }

            return Ok(objetivo);
        }

        // PUT: api/Objetivos/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutObjetivo(int id, Objetivo objetivo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != objetivo.IdObjetivo)
            {
                return BadRequest();
            }

            db.Entry(objetivo).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ObjetivoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Objetivos
        [ResponseType(typeof(Objetivo))]
        public async Task<IHttpActionResult> PostObjetivo(Objetivo objetivo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Objetivoes.Add(objetivo);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = objetivo.IdObjetivo }, objetivo);
        }

        // DELETE: api/Objetivos/5
        [ResponseType(typeof(Objetivo))]
        public async Task<IHttpActionResult> DeleteObjetivo(int id)
        {
            Objetivo objetivo = await db.Objetivoes.FindAsync(id);
            if (objetivo == null)
            {
                return NotFound();
            }

            db.Objetivoes.Remove(objetivo);
            await db.SaveChangesAsync();

            return Ok(objetivo);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ObjetivoExists(int id)
        {
            return db.Objetivoes.Count(e => e.IdObjetivo == id) > 0;
        }
    }
}