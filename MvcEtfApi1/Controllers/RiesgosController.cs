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
    public class RiesgosController : ApiController
    {
        private AnalisisRiesgosConnect db = new AnalisisRiesgosConnect();

        // GET: api/Riesgos
        public IQueryable<Riesgo> GetRiesgoes()
        {
            return db.Riesgoes;
        }

        // GET: api/Riesgos/5
        [ResponseType(typeof(Riesgo))]
        public async Task<IHttpActionResult> GetRiesgo(int id)
        {
            Riesgo riesgo = await db.Riesgoes.FindAsync(id);
            if (riesgo == null)
            {
                return NotFound();
            }

            return Ok(riesgo);
        }

        // PUT: api/Riesgos/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutRiesgo(int id, Riesgo riesgo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != riesgo.IdRiesgo)
            {
                return BadRequest();
            }

            db.Entry(riesgo).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RiesgoExists(id))
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

        // POST: api/Riesgos
        [ResponseType(typeof(Riesgo))]
        public async Task<IHttpActionResult> PostRiesgo(Riesgo riesgo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Riesgoes.Add(riesgo);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = riesgo.IdRiesgo }, riesgo);
        }

        // DELETE: api/Riesgos/5
        [ResponseType(typeof(Riesgo))]
        public async Task<IHttpActionResult> DeleteRiesgo(int id)
        {
            Riesgo riesgo = await db.Riesgoes.FindAsync(id);
            if (riesgo == null)
            {
                return NotFound();
            }

            db.Riesgoes.Remove(riesgo);
            await db.SaveChangesAsync();

            return Ok(riesgo);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool RiesgoExists(int id)
        {
            return db.Riesgoes.Count(e => e.IdRiesgo == id) > 0;
        }
    }
}